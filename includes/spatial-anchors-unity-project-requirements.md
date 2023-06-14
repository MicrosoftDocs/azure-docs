---
author: pamistel
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 11/12/2021
ms.author: pamistel
---
When you start a new Unity project, you can choose between the [Unity XR Plug-in Framework](https://docs.unity3d.com/Manual/XRPluginArchitecture.html) and Legacy Built-in XR.

### [XR Plug-in Framework](#tab/xr-plugin-framework)

The XR Plug-in Framework is only supported on ASA SDK version 2.9.0 or later. To target the XR Plug-in Framework, use Unity [2020.3 (LTS)](https://unity3d.com/unity/whats-new/2020.3.0), and AR Foundation [4.1.7](https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@4.1/manual/index.html) with the following packages, depending on your platform:
- Mixed Reality OpenXR Plugin: [1.1.2](/windows/mixed-reality/develop/unity/new-openxr-project-without-mrtk)
- Windows XR Plugin: [4.5.0](https://docs.unity3d.com/Packages/com.unity.xr.windowsmr@4.5/manual/index.html)
- ARCore XR Plugin: [4.1.7](https://docs.unity3d.com/Packages/com.unity.xr.arcore@4.1/manual/index.html)
- ARKit XR Plugin: [4.1.7](https://docs.unity3d.com/Packages/com.unity.xr.arkit@4.1/manual/index.html)

### [Legacy Built-in XR](#tab/legacy-built-in-xr)

Legacy Built-in XR is only supported on ASA SDK version 2.8.1 or earlier. To target Legacy Built-in XR, use Unity [2019.4 (LTS)](https://unity.com/releases/2019-lts) and AR Foundation [3.1.3](https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@3.1/manual/index.html) with the following packages, depending on your platform:
- Windows Mixed Reality: [4.2.1](https://docs.unity3d.com/Packages/com.unity.xr.windowsmr.metro@4.2/manual/index.html)
- ARCore XR Plugin: [3.1.3](https://docs.unity3d.com/Packages/com.unity.xr.arcore@3.1/manual/index.html)
- ARKit XR Plugin: [3.1.3](https://docs.unity3d.com/Packages/com.unity.xr.arkit@3.1/manual/index.html)
