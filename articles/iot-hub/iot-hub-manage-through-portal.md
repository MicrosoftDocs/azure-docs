<properties
 pageTitle="Manage Azure IoT Hubs through the Azure portal | Microsoft Azure"
 description="An overview of how  to create and manage Azure IoT Hubs through the Azure Portal"
 services="azure-iot"
 documentationCenter=".net"
 authors="nasing"
 manager="timlt"
 editor=""/>

<tags
 ms.service="azure-iot"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/04/2015"
 ms.author="nasing"/>

# Manage IoT Hubs through Azure Portal

## Introduction:

This document outlines how to get started with Azure IoT Hubs through the Azure portal. This document will cover how to find IoT Hubs andas well as how to create and manage the IoT hubs.

## Where to find IoT hubs:

There are a number of places through which you can find IoT hubs.

1."+ New ": Azure IoT hubs is a service for Internet of things and therefore can be found under the category “Internet of Things” under “+New” similar to other services.



2.IoT hubs can also be accessed through the Marketplace as the hero service under Internet of Things.



## How to create an IoT Hub

The creation of Azure IoT hub can be accessed through the methods listed above and needs to follow all the steps below.

1. Creating IoT Hub through “+ New” will lead to the final blade shown below. The steps for creating the IoT hub through this method as well as through the marketplace are identical.

2. Creating IoT Hub through marketplace: Clicking on the “Create” button will open a blade that is identical to the blade above for the “+New “experience. There are several steps involved in creating an IoT Hub that are listed below:

    

### Choosing the Name of the IoT Hub

In order to create an IoT Hub, the user must name the IoT hub. Please note this name has to be unique across the hubs, no duplication of hubs is allowed at the backend, so it is recommended that this hub be named as uniquely as possible.

### Choosing the Pricing tier 

The customer can choose from 3 tiers: Free, Standard 1 and Standard 2 as shown below.
 
![][4]


Please note that IoT hub allows only 1 free hub per subscription. Else it will show an error.



### IoT hub units 

An IoT unit includes 500 devices, so choosing the number of IoT units means total devices supported for this hub are number of units multiplied by 500. As an example, if you want the IoT hub to support 1000 devices, the number of units you need to choose are 2.

### Device to Cloud partitions and Resource Group 

Acustomer can change the number of partitions for an IoT hub if they so desire. Default partitions are set to 4 however customers can choose a different number of partitions from a drop down list.

Resource Group: You do not need to explicitly create an empty resource group. When creating a new resource, you can choose to either create a new resource group or use an existing resource group. 

![][5]

### Choosing Subscriptions 

The Azure IoT Hub will automatically show the list of subscriptions which the user account is linked to. The user can choose one of the options here to associate their Azure IoT hub to that subscription.

### Choosing the location

The location option provides a list of the regions where IoT Hub is offered. For Public Preview, the hub is offered in 3 locations only: US East, Europe North and East Asia. 

![][6]

### Creating the IoT Hub

Once all the above listed steps are complete, the IoT Hub is now ready to be created.  Clicking on the create button will kick off the backend process of creating this IoT hub with the customer specifications and deploying it in the location specified.

Please note that it can take a few minutes for the IoT hub to be created as it takes time for the backend deployment to occur in the appropriate location servers.



## Changing the settings of the IoT Hub
The settings of an existing IoT hub can be changed or modified after it is created. Clicking and choosing the IoT hub will open up the settings page.

![][8]


Shared Access Policies: Clicking on the Shared Accessing Policies under Settings opens up a blade where you can modify existing policies or add a new policy.



Creating a new policy is simple. 
- Clicking on the Add button opens up a blade where the new policy name can be typed and the policies associated chosen as can be seen from the screen below. There are a number of permissions that can be associated with these shared policies. The first two Registry Read and Write are for granting access read and write rights to the Device identity store or the identity registry. The Service connect policy will grant permission to the consumer group for services connecting to the IoT Hub where as the Device connect is granting permissions for device side of the IoT hub ![][9]
- Clicking on the create policy will add this newly created policy to the existing list.

![][10]

## Messaging 

Clicking on the Messaging policies opens up a list of messaging properties for the IoT Hub that is being modified. The properties that can be modified or copied are for Cloud to Device and Device to Cloud
- Cloud to Device Settings: This has 2 settings only:- Cloud to Device TTL (Time to Live) and Retention time for the messages. Both the settings for this are created with a default value of 1 hour when the IoT hub is first created. However, these can be customized if needed very easily using the inbuilt sliders or just typing in the values. 
- Device to Cloud Settings: This has a few settings that are named/assigened when the IoT Hub is created and can only be copied and others that are customizable.
Partitions - This value is set when the IoT Hub is created and can be changed through this setting.
Event Hub compatible name and endpoint - When the IoT Hub is created, as part of that process an event hub is created internally which the user may need access to under certain circumstances. This event hub name and endpoint cannot be customized but is available for use via the copy button.
Retention Time: Set to 1 day by default but can be customized to other values using the drop down. Please note that this value is in days for Device to Cloud and not in hours as the similar setting for Cloud to Device.
- Consumer Groups - Consumer Groups are a setting similar to other messaging systems that can be used to pull data in specific ways to connect other applications or services to IoT hub. Every IoT Hub is created with a default consumer group. However, if the customer wants they can add or delete consumer groups to their IoT Hubs.
Note: The default consumer group cannot be edited/deleted. 
![][11]


## Pricing and Scale:
The pricing of an existing IoT hub can be changed through the Pricing settings with the following exceptions:
In the current implementation, an IoT Hub with a free SKU cannot change tiers to one of the paid SKU's or vice versa.
There can only be one free tier IoT Hub in the scubscription.
![][12]
Moving from a high tier (S2) to low tier (S1) is allowed only when the number of messages sent for that day are not in conflict. For e.g. if the number of messages per day has exceed 50,000 then tier for the IoT Hub cannot be changed from S2 to S1.



## Deleting the IoT Hub

Deleting the IoT hub is very straightforward. You can browse to the IoT hub you want to delete by clicking on Browse and then choosing the appropriate hub to delete. Clicking on the Delete button below the hub name will delete the hub.



  
  [4]: ./media/Create_IoTHub.png
  [5]:./ media/Location.png
  [6]: ./media/image7.png

  [8]: media/Settings.png

  [10]: media/SharedAccessPolicies.png
  [11]: media/Messaging_Settings.png
  [12]: media/Pricing_Error.png
