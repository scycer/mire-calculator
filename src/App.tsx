import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import './App.css'

// Rounding constant (1 for nearest whole number, 10 for nearest 10, etc.)
const ROUNDING_FACTOR = 1

function App() {
  const [gvwr, setGvwr] = useState(0)
  const [angleResistance, setAngleResistance] = useState(0)
  const [surfaceModifier, setSurfaceModifier] = useState(0)
  const [mireDepthModifier, setMireDepthModifier] = useState(0)
  const [estimatedResistance, setEstimatedResistance] = useState(0)
  const [safetyMargin, setSafetyMargin] = useState(0)
  const [totalResistance, setTotalResistance] = useState(0)

  const round = (value: number) => Math.round(value / ROUNDING_FACTOR) * ROUNDING_FACTOR

  useEffect(() => {
    const newEstimatedResistance = round(angleResistance + surfaceModifier + mireDepthModifier)
    const newSafetyMargin = round(newEstimatedResistance * 0.2)
    const newTotalResistance = round(newEstimatedResistance + newSafetyMargin)

    setEstimatedResistance(newEstimatedResistance)
    setSafetyMargin(newSafetyMargin)
    setTotalResistance(newTotalResistance)
  }, [gvwr, angleResistance, surfaceModifier, mireDepthModifier])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resistance Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gvwr">GVWR (Maximum Loaded Weight of the Vehicle)</Label>
            <Input
              id="gvwr"
              placeholder="Enter GVWR in kg or lb"
              type="number"
              value={gvwr || ''}
              onChange={(e) => setGvwr(round(Number(e.target.value)))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="angle">Angle Resistance</Label>
            <Select onValueChange={(value) => setAngleResistance(round(gvwr * Number(value)))}>
              <SelectTrigger id="angle">
                <SelectValue placeholder="Select angle" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0.2">10 Degrees (GVWR x 0.2)</SelectItem>
                <SelectItem value="0.4">20 Degrees (GVWR x 0.4)</SelectItem>
                <SelectItem value="0.6">30 Degrees (GVWR x 0.6)</SelectItem>
                <SelectItem value="0.8">40 Degrees (GVWR x 0.8)</SelectItem>
                <SelectItem value="1.0">50 Degrees (GVWR x 1.0)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="surface">Surface Modifier</Label>
            <Select onValueChange={(value) => setSurfaceModifier(gvwr * Number(value))}>
              <SelectTrigger id="surface">
                <SelectValue placeholder="Select surface type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0.1">Hard Pack Dirt / Pavement (GVWR x 0.1)</SelectItem>
                <SelectItem value="0.2">Gravel, Grass, Hard/Wet Sand (GVWR x 0.2)</SelectItem>
                <SelectItem value="0.3">Thin Mud, Dry Sand (GVWR x 0.3)</SelectItem>
                <SelectItem value="0.4">Thick Mud, Soft Wet Sand (GVWR x 0.4)</SelectItem>
                <SelectItem value="0.5">Sticky Mud / Clay (GVWR x 0.5)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mire">Mire Depth Modifier</Label>
            <Select onValueChange={(value) => setMireDepthModifier(gvwr * Number(value))}>
              <SelectTrigger id="mire">
                <SelectValue placeholder="Select mire depth" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="1.0">Wheel Depth (GVWR x 1.0)</SelectItem>
                <SelectItem value="2.0">Hub/Frame Depth (GVWR x 2.0)</SelectItem>
                <SelectItem value="3.0">Body/Hood Depth (GVWR x 3.0)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estimated Resistance (Angle + Surface + Mire)</Label>
            <Input value={estimatedResistance} disabled />
          </div>

          <div className="space-y-2">
            <Label>20% Safety Margin</Label>
            <Input value={safetyMargin} disabled />
          </div>

          <div className="space-y-2">
            <Label>Total Estimated Resistance</Label>
            <Input value={totalResistance} disabled />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default App
