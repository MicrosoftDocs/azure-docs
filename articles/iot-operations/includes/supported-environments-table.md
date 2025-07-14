---
author: dominicbetts
ms.author: dobett
ms.topic: include
ms.service: iot-operations
ms.date: 06/20/2025
---

Microsoft supports the following Kubernetes distributions for Azure IoT Operations deployments. The following table lists their support levels and the environments Microsoft uses to validate the deployments:

| Kubernetes distribution           | Support level        | *Minimum validated version*         | *Minimum validated OS*                |
|-----------------------------------|----------------------|-----------------------------------|-------------------------------------|
| K3s                               | General availability | *1.31.1*                            | *Ubuntu 24.04*                        |
| Tanzu Kubernetes release (TKr)    | General availability | *1.28.11*                           | *Tanzu Kubernetes Grid 2.5.2*         |
| AKS Edge Essentials               | Public preview       | *AksEdge-K3s-1.29.6-1.8.202.0*      | *Windows 11 IoT Enterprise*           |
| AKS on Azure Local                | Public preview       | *Azure Stack HCI OS, version 23H2, build 2411* | *Azure Stack HCI OS, version 23H2* |

* The *minimum validated version* is the lowest version of the Kubernetes distribution that Microsoft uses to validate Azure IoT Operations deployments.
* The *minimum validated OS* is the lowest operating system version that Microsoft uses to validate deployments.

>[!IMPORTANT]
>Support for Azure IoT Operations deployments is only available on version 1.28.11 of TKr.
