import React from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { add, divide } from "react-native-reanimated";
import { decompose2d, vec } from "react-native-redash";
import { Matrix4, matrixVecMul4 } from "./Matrix4";
import { Point, SIZE, transform2d, vec3 } from "./ThreeDMath";

interface FaceProps {
  points: readonly [Point, Point, Point, Point];
  backgroundColor: string;
  label: string;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
});

const avg = (
  ...v: [
    Animated.Adaptable<number>,
    Animated.Adaptable<number>,
    ...Animated.Adaptable<number>[]
  ]
) => divide(add(...v), v.length);

const canvas = {
  p1: vec.create(-SIZE / 2, -SIZE / 2),
  p2: vec.create(-SIZE / 2, SIZE / 2),
  p3: vec.create(SIZE / 2, -SIZE / 2),
  p4: vec.create(SIZE / 2, SIZE / 2),
};

const Face = ({
  points: [p1, p2, p3, p4],
  backgroundColor,
  label,
}: FaceProps) => {
  const shape2d = transform2d({
    canvas,
    projected: {
      p1,
      p2,
      p3,
      p4,
    },
  });
  const {
    translateX,
    translateY,
    rotateZ,
    skewX,
    scaleX,
    scaleY,
  } = decompose2d(shape2d);
  const zIndex = avg(p1.z, p2.z, p3.z, p4.z);
  return (
    <Animated.View style={[styles.container, { zIndex }]} pointerEvents="none">
      <Animated.View
        style={{
          opacity: 0.61,
          width: SIZE,
          height: SIZE,
          backgroundColor,
          justifyContent: "center",
          alignItems: "center",
          transform: [
            { translateX },
            { translateY },
            { rotateZ: skewX },
            { scaleX },
            { scaleY },
            { rotateZ },
          ],
        }}
      >
        <Text style={{ color: "white", fontSize: 24 }}>{label}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default Face;
