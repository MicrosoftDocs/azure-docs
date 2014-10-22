<properties title="Register multiple devices using the ISS management portal" pageTitle="Register multiple devices using the ISS management portal" description="Learn how to pre-register devices in the ISS management portal." metaKeywords="Intelligent Systems,ISS,IoT,device registration" services="intelligent-systems" solutions="" documentationCenter="" authors="jdecker" manager="alanth" videoId="" scriptId="" />

<tags ms.service="intelligent-systems" ms.devlang="na" ms.topic="article" ms.tgt_pltfrm="na" ms.workload="tbd" ms.date="11/13/2014" ms.author="jdecker" ms.prod="azure">

#Register multiple devices in ISS
For a device to send data to your Azure Intelligent Systems Service (ISS) account, the device must be registered. You can pre-register multiple devices to your ISS account by uploading a text file that provides the mandatory information for all devices that you want to register. When you register devices in the ISS management portal, you can obtain per-device security tokens which can be provisioned on the devices. Read [Best practices for device registration](./iss-best-practice-device-registration.md) to learn why we recommend that you use per-device security tokens rather than device endpoint access keys on your devices.  

The text file that defines the devices to register uses comma-separated values for the following information:  

-	Device name (required)
-	Model name (required)
-	Device friendly name
-	Description
-	Pricing tier (use one of the following case-sensitive values: **ExtraSmall**, **Small**, **Medium**, or **Large**)
 
	>[AZURE.NOTE] When no value is specified for pricing tier, the device is assigned to the default pricing tier.  

The following is an example of two entries in a properly formatted registration file.  


	AutoRegister41,Contoso.Aircraft.AircraftModel,1st EM.Concorde Jet,The 1st Concorder Flight,Small
	AutoRegister42,Contoso.Aircraft.AircraftModel,2nd EM.Concorde Jet,Jet No.009,ExtraSmall  

>[AZURE.NOTE] The model definition must be provided to your ISS account before you can register any devices to use that model.   

##Register multiple devices  

1.	In the ISS management portal, go to **Devices** > **Actions** > **Register devices**.  
2.	Browse to the registration file, and click **Upload**.</br>
You will see an error message if the registration file does not validate. This validation check verifies only that the registration file is formatted correctly. 
3.	When device registration is complete, **Registration status** will display the number of devices registered and the number of devices that failed to register. If a device failed to register, click **errors.csv** to download the error messages. Click **Save** to download the per-device security keys.  

	![][1]  

	 -	Error message **A request to add a device failed because the specified model was not found** means that the device model specified in the registration file is incorrect. The device model name might be typed incorrectly or that device model has not been uploaded to ISS yet. Make sure that the device model is uploaded to ISS and the name is typed correctly in the registration file, and then retry registration by uploading the file again.
	-	Error message **The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later** means that there was a server error, not a problem with the registration file. Retry registration by uploading the file again.  

After your registration file is uploaded, you will see the newly-registered devices in **All Devices**. When a registered device connects to ISS and begins to send data, the device status will change to **Active**.  

If you don't save the tokens during registration, you can get tokens for registered devices as well. 

##Get tokens for registered devices 

1.	In **Devices**, select the checkboxes for the devices or device groups that you want to get tokens for.
2.	On the **Actions** menu, click **Generate token**. This will generate new tokens for the selected devices.
3.	Click **Save** to download the csv file of device names and corresponding security tokens.


[1]: ./media/iss-device-registration-portal/iss-device-registration-portal-01.png

