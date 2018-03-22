---
title: Azure solutions for Internet of Things (IoT Suite) 
description: Overview of a Azure IoT, a sample IoT solution architecture, and how it relates to devices, the Azure IoT Hub service, Azure IoT device SDKs, Azure IoT service SDKs, and other Azure services.
services: iot
documentationcenter: ''
author: BryanLa
manager: timlt
editor: ''

ms.service: iot
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/30/2018
ms.author: bryanla

---
[!INCLUDE [iot-azure-and-iot](../../includes/iot-azure-and-iot.md)]

## Technologies and solutions available for building an Azure IoT solution

Microsoft has built a portfolio that supports the needs of all customers, enabling everyone to access the benefits of digital transformation. The section provides an overview of the available  technologies and solutions, providing detail on the paths available for building your own solution:

| **Edge** | **Solutions** | **Platform services** |
|------|-----------|-------------------|
| Client-side technologies<br><br>&#9657; [IoT Edge][lnk-iot-edge-land]<br>&#9657; [IoT Device/Service SDKs][lnk-device-sdks] | Software as a Service (SaaS) offerings<br><br>&#9657; [Iot Suite][lnk-iot-suite-land] | Platform as a Service (PaaS) Offerings<br><br>&#9657; [IoT Hub][lnk-iot-hub-land] |
|    |    |    |

<ul class="panelContent cardsF">
    <li>
        <div class="cardSize">
            <div class="cardPadding">
                <div class="card">
                    <div class="cardText">
                        <h3>Edge</h3>
                        <a href="/azure/iot-edge/index.yml">IoT Edge</a><br/>
                        <a href="/azure/iot-edge/how-iot-edge-works">What is IoT Edge?</a>
                    </div>
                </div>
            </div>
        </div>
    </li>
    <li>
        <div class="cardSize">
            <div class="cardPadding">
                <div class="card">
                    <div class="cardText">
                        <h3>Solutions</h3>
                        <a href="/azure/iot-suite/index.md">IoT Suite</a><br/>
                        <a href="/azure/iot-suite/iot-suite-what-are-preconfigured-solutions">What is IoT Suite?</a>
                    </div>
                </div>
            </div>
        </div>
    </li>
    <li>
        <div class="cardSize">
            <div class="cardPadding">
                <div class="card">
                    <div class="cardText">
                        <h3>Platform services</h3>
                        <a href="/azure/iot-hub/index.yml">IoT Hub</a><br/>
                        <a href="/azure/iot-hub/iot-hub-what-is-iot-hub">What is IoT Hub?</a>
                    </div>
                </div>
            </div>
        </div>
    </li>        
</ul>

- Edge: IoT Edge, IoT device/service SDKs
- Solutions: IoT Suite, IoT Suite Preconfigured Solutions, IoT Central (leverage another application to build a solution, for instance, IoT Central solutions)
- Platform services: Platform as a Service (PaaS) offerings, IoT Hub, DPS, LBS, Time Series Insights (build your own application using IoT Suite, PCS, and all Technologies)

![The industry's most comprehensive portfolio of technologies and solutions][img-paas-saas-technologies-solutions]

## Next steps

See the Table of Contents to the left for the list of Azure IoT services you might wish to explore.

[img-paas-saas-technologies-solutions]: media/iot-technologies-solutions/paas-saas-technologies-solutions.png


[lnk-device-sdks]: https://github.com/Azure/azure-iot-sdks
[lnk-iot-edge-land]: ../iot-edge/index.yml
[lnk-iot-hub-land]: ../iot-hub/index.yml
[lnk-iot-suite-land]: ../iot-suite/index.md


[lnk-getstarted]: ../iot-hub/iot-hub-csharp-csharp-getstarted.md
[lnk-iotdev]: https://azure.microsoft.com/develop/iot/
[lnk-device-management]: ../iot-hub/iot-hub-device-management-overview.md
