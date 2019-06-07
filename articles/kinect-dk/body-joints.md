---
title:  Azure Kinect body tracking joints
description: Using body frame and joints
author: qm13
ms.author: cedmonds, abalan, quentinm
ms.prod: kinect-dk
ms.date: 06/06/2019
ms.topic: conceptual
keywords: kinect, porting, body, tracking, joint, hierarchy, bone, connection
---

# Body tracking joints

Azure Kinect body tracking can track multiple human bodies at the same time. Each body includes an ID for temporal correlation between frames and the kinematic skeleton. The number of bodies detected in each frame can be acquired using `k4abt_frame_get_num_bodies()`.

## Joints

Joint position and orientation are estimates relative to the depth sensor frame of reference. The position is specified in millimeters. The orientation is expressed as a normalized quaternion and is the local orientation of the connection (bone) with child joints.

## Joint coordinates

The position and orientation of each joint form its own joint coordinate system. All joint coordinate systems are absolute coordinate systems relative to the depth camera 3D coordinate system.

![Joint coordinates](./media/concepts/joint-coordinates.png)

## Joint hierarchy

A skeleton includes 24 joints with the joint hierarchy flowing from the center of the body to the extremities. Each connection (bone) links the parent with a child. The figure illustrates the joint locations and connection relative to the human body.

![Joint hierarchy](./media/concepts/joint-hierarchy.png)

The following table enumerates the standard joint connections.

|Index |Joint name     | Parent joint   |
|------|---------------|----------------|
| 0    |PELVIS         | -              |
| 1    |SPINE_NAVAL    | PELVIS         |
| 2    |SPINE_CHEST    | SPINE_NAVAL    |
| 3    |NECK           | SPINE_CHEST    |
| 4    |CLAVICLE_LEFT  | SPINE_CHEST    |
| 5    |SHOULDER_LEFT  | CLAVICLE_LEFT  |
| 6    |ELBOW_LEFT     | SHOULDER_LEFT  |
| 7    |WRIST_LEFT     | ELBOW_LEFT     |
| 8    |CLAVICLE_RIGHT | SPINE_CHEST    |
| 9    |SHOULDER_RIGHT | CLAVICLE_RIGHT |
| 10   |ELBOW_RIGHT    | SHOULDER_RIGHT |
| 11   |WRIST_RIGHT    | ELBOW_RIGHT    |
| 12   |HIP_LEFT       | PELVIS         |
| 13   |KNEE_LEFT      | HIP_LEFT       |
| 14   |ANKLE_LEFT     | KNEE_LEFT      |
| 15   |HIP_RIGHT      | PELVIS         |
| 16   |KNEE_RIGHT     | HIP_RIGHT      |
| 17   |ANKLE_RIGHT    | KNEE_RIGHT     |
| 18   |HEAD           | NECK           |
| 19   |NOSE           | HEAD           |
| 20   |EYE_LEFT       | HEAD           |
| 21   |EAR_LEFT       | HEAD           |
| 22   |EYE_RIGHT      | HEAD           |
| 23   |EAR_RIGHT      | HEAD           |

## Next steps

> [!div class="nextstepaction"]
>[Coordinate systems](body-index-map.md)