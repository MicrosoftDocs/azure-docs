<properties 
   pageTitle="Azure Mobile Engagement Troubleshooting Guide - Service" 
   description="Troubleshooting Guides for Azure Mobile Engagement" 
   services="mobile-engagement" 
   documentationCenter="" 
   authors="piyushjo" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="mobile-engagement"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="mobile-multiple"
   ms.workload="mobile" 
   ms.date="02/29/2016"
   ms.author="piyushjo"/>

# Troubleshooting guide for Service issues

The following are possible issues you may encounter with how Azure Mobile Engagement runs.

## Service Outages

### Issue
- Issues that appear to be caused by Azure Mobile Engagement Service Outages.

### Causes
- Issues that appear to be caused by Azure Mobile Engagement Service Outages can be caused by several different issues:
    - Isolated issues that originally appear systemic to all of Azure Mobile Engagement
    - Known issues caused by server outages (not always shows in server status):
	- Scheduling delays, Targeting errors, Badge update issues, Statistics stop collecting, Push stops working, API's stop working, New apps or users can't be created, DNS errors, and Timeout errors in the UI, API, or Apps on a device.
    - Cloud Dependency Outages
[Azure Service Status](http://status.azure.com/)
    - Push Notification Services (PNS) Dependency Outages
    - App Store Outages

1) To test to see if the problem is systemic you can test the same function from a different
   
   - Azure Mobile Engagement integrated application
   - Test device
   - Test device OS version
   - Campaign
   - Administrator user account
   - Browser (IE, Firefox, Chrome, etc.)
   - Computer

2) To test if the problem only affects the UI or the API's:

   - Test the same function from both the Azure Mobile Engagement UI and the Azure Mobile Engagement API's.

3) To test if the problem is with your Cellular Phone Network:

   - Test while connected to the Internet via WIFI and while connected via your 3G cellular phone network.
   - Confirm that your firewall is not blocking any of the Azure Mobile Engagement IP Addresses or Ports.

4) To test if the problem is with your Device:

   - Test if your Device is able to connect to Azure Mobile Engagement with another Azure Mobile Engagement integrated app.
   - Test that you can generate Events, Jobs, and Crashes from your phone that can be seen in the Azure Mobile Engagement UI. 
   - Test if you can send push notifications from the Azure Mobile Engagement UI to your device based on its Device ID. 

5) To test if the problem is with your App:

   - Install and test your application from an emulator instead of from a physical device:
   
6) To test if the problem is with OS upgrades to end user Devices, which require an SDK upgrade to resolve:

   - Test your application on different devices with different versions of the OS.
   - Confirm that you are using the most recent version of the SDK.
 
## Connectivity and Incorrect Information Issues

### Issue
- Problems logging into the Azure Mobile Engagement UI.
- Connection errors with the Azure Mobile Engagement API's.
- Problems uploading App Info Tags via the Device API.
- Problems downloading logs or exported data from Azure Mobile Engagement.
- Incorrect information shown in the Azure Mobile Engagement UI.
- Incorrect information shown in Azure Mobile Engagement logs.

### Causes
* Confirm your user account has sufficient permissions to perform the task.
* Confirm that the problem is not isolated to one computer or your local network.
* Confirm that that the Azure Mobile Engagement service has no reported outages.
* Confirm that your App Info Tag files follow all of these rules:
	- Use only the UTF8 character set (the ANSI character set is not supported).
    - Use a comma "," as the separator character (you can open a service request to request to change the .csv separator character from a comma "," to another character such as a semi-colon ";").
    - Use all lower case for Boolean values "true" and "false".
    - Use a file that is smaller than the maximum file size of 35MB.
 