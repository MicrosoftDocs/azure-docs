<properties
   pageTitle="Azure IoT protocol gateway | Microsoft Azure"
   description="Describes how to use Azure IoT protocol gateway to extend the capabilities of Azure IoT Hub"
   services="iot-hub"
   documentationCenter=".net"
   authors="kdotchkoff"
   manager="kevinmil"
   editor=""/>

<tags
   ms.service="iot-hub"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="required"
   ms.date="09/29/2015"
   ms.author="kdotchkoff"/>

# Protocol Adaptation for IoT Hub
IoT Hub natively supports communication over the HTTPS and AMQP protocols. In some cases devices or field gateways might not be able to use one of these standard protocols and will require protocol adaptation. In such cases, a custom gateway can enable protocol adaptation for IoT Hub endpoints by bridging the traffic to and from IoT Hub. Azure IoT protocol gateway enables protocol adaptation for IoT Hub and implements an MQTT protocol adapter to enable communicattion between IoT device and IoT Hub over the MQTT protocol. 

## Azure IoT Protocol Gateway
Azure IoT protocol gateway is a framework for protocol adaptation designed for high-scale, bi-directional device communication with IoT Hub. The protocol gateway is a pass-through component accepting device connections over a specific protocol and bridging the traffic to IoT Hub over AMQP 1.0.The IoT protocol gateway is available as an open-source software (OSS) project to provide flexibility for adding support for variety of protocols and protocol vesions.

The protcol gateway can be deployd in Azure in a highly scalable way using Cloud Services worker roles. In addtion the protocol gateway can be deployed in on-premisses environments such as field gateways.

The Azure IoT protocol gateway includes an MQTT adapter to facilitate communication with devices over the MQTT v3.1.1 protocol. The protocl gateway and MQTT implementation are provided as am OSS project for flexibility to allow for customizations of the implementation as needed.   
The MQTT adapter also demonstartes the programing model for building protocl adapters for other protocols. In addition, the IoT protocol gateway programming model allows to plug in custom components for specialized processing such as custom authentication, message transformations, compression/decompression, or encryption/decryption of traffic between the devices and IoT Hub. 

## Further Information and Next Steps 

To learn more about Azure IoT protocol gateway and how to use and deploy it as part of your IoT solution please refer to:

1. Azure IoT protocol gatway getting started guide

    [Link 1 to the getting started guide in the GitHub repo](web-sites-custom-domain-name.md)
    

2. Azure IoT protocol gateway developer guide 

    [Link 1 to the dev  guide in in the topic](web-sites-custom-domain-name.md)
   	    
3. Azure IoT protocol gateway repository on GitHub 

    [Link 1 to the GitHub repo](web-sites-custom-domain-name.md)

   

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[gog]: http://google.com/        
[yah]: http://search.yahoo.com/  
[msn]: http://search.msn.com/    
