import { View, StyleSheet } from 'react-native'
import Svg, { Circle, G, Path } from 'react-native-svg'
import { colors } from '../theme/colors'

interface PieSlice {
  value: number
  color: string
  label?: string
}

interface PieChartProps {
  slices: PieSlice[]
  size?: number
  strokeWidth?: number
}

export default function PieChart({ slices, size = 200, strokeWidth = 32 }: PieChartProps) {
  const total = slices.reduce((sum, s) => sum + s.value, 0)
  const center = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  if (total === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
        </Svg>
      </View>
    )
  }

  let cumulativePercent = 0

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {slices.map((slice, index) => {
            const percent = slice.value / total
            const strokeDasharray = `${percent * circumference} ${circumference}`
            const strokeDashoffset = -cumulativePercent * circumference
            cumulativePercent += percent

            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={slice.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            )
          })}
        </G>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})