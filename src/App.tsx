import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./App.css";

// Rounding constant (1 for nearest whole number, 10 for nearest 10, etc.)
const ROUNDING_FACTOR = 100;

function App() {
  const [gvwr, setGvwr] = useState(() => {
    const saved = localStorage.getItem("gvwr");
    return saved ? Number(saved) : 0;
  });
  const [angleResistance, setAngleResistance] = useState(() => {
    const saved = localStorage.getItem("angleResistance");
    return saved ? Number(saved) : 0;
  });
  const [surfaceModifier, setSurfaceModifier] = useState(() => {
    const saved = localStorage.getItem("surfaceModifier");
    return saved ? Number(saved) : 0;
  });
  const [mireDepthModifier, setMireDepthModifier] = useState(() => {
    const saved = localStorage.getItem("mireDepthModifier");
    return saved ? Number(saved) : 0;
  });
  const [estimatedResistance, setEstimatedResistance] = useState(0);
  const [safetyMargin, setSafetyMargin] = useState(0);
  const [totalResistance, setTotalResistance] = useState(0);

  const [angleValue, setAngleValue] = useState(() => {
    const saved = localStorage.getItem("angleValue");
    return saved || "";
  });
  const [surfaceValue, setSurfaceValue] = useState(() => {
    const saved = localStorage.getItem("surfaceValue");
    return saved || "";
  });
  const [mireValue, setMireValue] = useState(() => {
    const saved = localStorage.getItem("mireValue");
    return saved || "";
  });

  const round = (value: number) =>
    Math.round(value / ROUNDING_FACTOR) * ROUNDING_FACTOR;

  useEffect(() => {
    // Recalculate values when GVWR changes
    setAngleResistance(round(gvwr * Number(angleValue)));
    setSurfaceModifier(round(gvwr * Number(surfaceValue)));
    setMireDepthModifier(round(gvwr * Number(mireValue)));

    const newEstimatedResistance = round(
      angleResistance + surfaceModifier + mireDepthModifier
    );
    const newSafetyMargin = round(newEstimatedResistance * 0.2);
    const newTotalResistance = round(newEstimatedResistance + newSafetyMargin);

    setEstimatedResistance(newEstimatedResistance);
    setSafetyMargin(newSafetyMargin);
    setTotalResistance(newTotalResistance);

    // Save to local storage
    localStorage.setItem("gvwr", gvwr.toString());
    localStorage.setItem("angleResistance", angleResistance.toString());
    localStorage.setItem("surfaceModifier", surfaceModifier.toString());
    localStorage.setItem("mireDepthModifier", mireDepthModifier.toString());
    localStorage.setItem("angleValue", angleValue);
    localStorage.setItem("surfaceValue", surfaceValue);
    localStorage.setItem("mireValue", mireValue);
  }, [
    gvwr,
    angleResistance,
    surfaceModifier,
    mireDepthModifier,
    angleValue,
    surfaceValue,
    mireValue,
  ]);

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Resistance Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gvwr">
              GVWR (Maximum Loaded Weight of Vehicle)
            </Label>
            <Input
              id="gvwr"
              placeholder="Enter GVWR in kg or lb"
              type="number"
              value={gvwr || ""}
              onChange={(e) => setGvwr(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="angle">Angle Resistance</Label>
            <Select
              onValueChange={(value) => {
                setAngleResistance(round(gvwr * Number(value)));
                setAngleValue(value);
              }}
              value={angleValue}
            >
              <SelectTrigger id="angle">
                <SelectValue placeholder="Select angle" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0.75">45 Degrees Uphill (ADD 75% or 0.75 of weight)</SelectItem>
                <SelectItem value="0.50">30 Degrees Uphill (ADD 50% or 0.50 of weight)</SelectItem>
                <SelectItem value="0.25">15 Degrees Uphill (ADD 25% or 0.25 of weight)</SelectItem>
                <SelectItem value="0">0 Degrees (Level, no calculation required)</SelectItem>
                <SelectItem value="-0.25">15 Degrees Downhill (SUBTRACT 25% or 0.25 of weight)</SelectItem>
                <SelectItem value="-0.50">30 Degrees Downhill (SUBTRACT 50% or 0.50 of weight)</SelectItem>
                <SelectItem value="-0.75">45 Degrees Downhill (SUBTRACT 75% or 0.75 of weight)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="surface">Surface Modifier</Label>
            <Select
              onValueChange={(value) => {
                setSurfaceModifier(gvwr * Number(value));
                setSurfaceValue(value);
              }}
              value={surfaceValue}
            >
              <SelectTrigger id="surface">
                <SelectValue placeholder="Select surface type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0.1">
                  Hard Pack Dirt / Pavement (GVWR x 0.1)
                </SelectItem>
                <SelectItem value="0.2">
                  Gravel, Grass, Hard/Wet Sand (GVWR x 0.2)
                </SelectItem>
                <SelectItem value="0.3">
                  Thin Mud, Dry Sand (GVWR x 0.3)
                </SelectItem>
                <SelectItem value="0.4">
                  Thick Mud, Soft Wet Sand (GVWR x 0.4)
                </SelectItem>
                <SelectItem value="0.5">
                  Sticky Mud / Clay (GVWR x 0.5)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mire">Mire Depth Modifier</Label>
            <Select
              onValueChange={(value) => {
                setMireDepthModifier(gvwr * Number(value));
                setMireValue(value);
              }}
              value={mireValue}
            >
              <SelectTrigger id="mire">
                <SelectValue placeholder="Select mire depth" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="1.0">Wheel Depth (GVWR x 1.0)</SelectItem>
                <SelectItem value="2.0">
                  Hub/Frame Depth (GVWR x 2.0)
                </SelectItem>
                <SelectItem value="3.0">
                  Body/Hood Depth (GVWR x 3.0)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t border-gray-200 ">
            <div className="flex justify-between items-center text-blue-600 font-bold bg-blue-50 rounded-lg p-2 border border-blue-100">
              <Label>Total Estimated Resistance:</Label>
              <span>
                {totalResistance
                  ? totalResistance.toLocaleString() + " kg"
                  : "---"}
              </span>
            </div>
            <div className="text-xs text-gray-600 p-4">
              <div className="flex justify-between items-center">
                <Label>Estimated Resistance:</Label>
                <span>
                  {estimatedResistance
                    ? estimatedResistance.toLocaleString() + " kg"
                    : "---"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Label>+ 20% Safety Margin:</Label>
                <span>
                  {safetyMargin ? safetyMargin.toLocaleString() + " kg" : "---"}
                </span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default App;
