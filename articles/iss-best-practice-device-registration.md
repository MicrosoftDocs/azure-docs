<properties title="Best practices for device registration in ISS" pageTitle="Best practices for device registration in ISS" description="Best practices for using security tokens and access keys for device registration in ISS." metaKeywords="Intelligent Systems,ISS,IoT,access,registration,device registration,security token" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">

##Best practices for device registration in ISS
For a device to send data to your Azure Intelligent Systems Service (ISS) account, the device must be registered. There are three ways that a device can be registered with ISS:  

-	**By using the ISS management portal - recommended**</br>
You can pre-register the device using the ISS management portal. After pre-registration, the service returns an initial per-device security token that can be deployed to the device. The security token is renewed when the device connects to ISS. Learn how to pre-register devices in [Register multiple devices in ISS](./iss-device-registration-portal.md).
-	**By using the management endpoint and the management endpoint access key**</br>
You can automate registration by developing a tool or script that uses the management endpoint and the management endpoint access key. Upon registration, the device obtains an initial security token. This security token is used to provide the device with additional endpoints and authorization to access Service Bus, entities which are used for bidirectional communication with the service. 
-	**By using the device endpoint and the device endpoint access key**</br>
You can configure the device application with the device endpoint and the device endpoint access key and install it on devices. The devices will connect to the device endpoint to register. Upon registration, the device obtains an initial security token. This security token is used to provide the device with additional endpoints and authorization to access Service Bus entities, which are used for bidirectional communication with the service. 
	>[AZURE.NOTE] You should only consider deploying a device endpoint access key to a device if you are sure that the device will not be exposed to physical vulnerabilities.   

##Risks of using the device endpoint access key
If your device is exposed to physical vulnerability while in possession of a device endpoint access key, the malicious user can perform the following malicious actions on your ISS account:  

-		Register other fake devices, up to the account limit. 
-	 Send data on behalf of any registered device, both legitimate devices and fake devices. 
-	 Listen to commands sent down to any device.   

By being able to perform the above actions, the malicious user can subject you to:  

-	Unexpected costs due to additional registered devices.
-	Unexpected costs for overages on ingress bandwidth.
-	Unexpected costs for data storage.
-	Unexpected data entries (malicious or corrupt) in your data sets.  

Given the severe implications of losing your device endpoint access key due to a physical vulnerability, you should only consider deploying one if you have absolute certainty of the physical security of your devices. 

##Risks of using per-device security token
The preferred option for device registration is pre-registering the device and using a per-device security token. If a device with a per-device security token is exposed to physical vulnerability, a malicious user can perform the following actions, but these actions are isolated to the device in question:   

-	Send data on behalf of the compromised device. 
-	Obtain the contents of any commands sent down to the device.   

By being able to perform the above actions, malicious user can subject you to:   

-	Unexpected costs for overages on ingress bandwidth.
-	Unexpected costs for data storage.
-	Unexpected data entries (malicious or corrupt) in your data sets.

##What to do if a device with a security token is compromised
If you detect that a device with a per-device security token has been exposed to physical vulnerability, you should:   

1.	Delete the device from ISS. This will prevent the malicious user from performing the above malicious actions. As soon as the service acknowledges that the device is deleted, the device will not be able to carry out any of the above actions. 
2.	Refrain from re-registering a device with the same name for at least 10 days. Security tokens are tied to the device name and registering a new device with the same name within 10 days of deletion may allow a malicious user to resume their malicious actions using the same token. 


##See Also
[ISS endpoints and access keys](./iss-endpoints-access-keys.md)
