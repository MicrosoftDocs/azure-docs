---
title: Ingesting Sensor Data
description: Provides step by step guidance to ingest Sensor data as a customer
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 02/14/2023
ms.custom: template-concept #Required; leave this attribute/value as-is.
---
# Sensor integration in Data Manager for Agriculture

Follow the below steps to integrate with a sensor partner to enable the partner to start pushing the data into your Data Manager for Agriculture instance.

## Step 1: Identify the sensor partner app and provide consent

Each sensor partner has their own multi-tenant AAD app created and published on the Data Manager for Agriculture platform. The sensor partner that is currently supported by default on the platform is Davis Instruments(sensorPartnerId: `DavisInstruments`). However, you are free to add your own sensors by being a sensor partner yourself. Follow [these steps](./sensor-partner.md) to sign up being a sensor partner on the platform.

To start using the on-boarded sensor partners, customers need to give consent to the sensor partner so that they start showing up in `App Registrations`. Please follow the steps below for the same -

1. Login to [Azure Portal](https://portal.azure.com/) using "Global Administrator" or "Privileged Role Administrator" credentials. [How to find Global Administrator?](https://docs.microsoft.com/en-us/answers/questions/40421/unsure-how-to-find-global-administrator.html)  

2. For Davis Instruments, please click on this [link](https://login.microsoftonline.com/common/adminconsent?client_id=30b00405-3b4e-4003-933c-0d96ce47d670) to provide consent. 

3. You will be redirected to the permission review page like below. AAD app would ask for minimum "read user profile" permission and that should be sufficient for sensor integration with Data Manager for Agriculture.

![Sensor partner consent popup](./media/sensor-partner-consent.png)

4. Click on "Accept" button above to grant admin consent. It'll grant admin consent and redirect to the app redirect URL. 

5. Now, look for `Davis Instruments WeatherLink Data Manager for Agriculture Connector` under All Applications tab in `App Registrations` page.
In this example, we can Partner 1, Partner 2, etc. to be listed.

![sensor-partners](./media/sensor-partners.png)

6. Copy the Application (client) ID for the specific partner app that you want to provide access to.

## Step 2: Add role assignment to the partner app

The next step is to assign roles in the Azure portal to provide Authorization to the sensor partner application. Data Manager for Agriculture uses <a href="https://docs.microsoft.com/en-us/azure/role-based-access-control/overview" target="_blank">Azure RBAC</a> to manage Authorization requests.

Login to <a href="https://portal.azure.com" target=" blank">Azure Portal</a> and navigate to your Resource Group in which Data Manager for Agriculture resource is created. 

> [!NOTE] Inside the resource group tab, if you do not find the created Data Manager for Agriculture resource, you need to enable the **show hidden types** checkbox to see the Data Manager for Agriculture resource that you had created.

You will find the IAM (Identity Access Management) menu option on the left hand side of the option pane as shown in the image below.

![Role Assignment in Farm Beats](./media/Role-Assignment.png)

Click **Add > Add role assignment**, and this opens up a pane the right side of the portal, choose the below role from the dropdown:

- **AgFood Platform Sensor Partner Contributor** - has all privileges in the CRU (Create, Read, Update) operations which are specific to sensors.

To complete the role assignment do the following steps:

1. Choose the above mentioned role.

2. Choose **User, group, or service principal** in the Assign access to section.

3. **Paste the sensor partner App Name or ID** in the Select section (as shown in the image below).

4. Click **Save** to assign the role.

![App Selection for Authorization](./media/sensor-partner-role.png)

This ensures that the sensor partner app has been granted access (based on the role assigned) to Azure FarmBeats Resource.

## Step 3: Enable sensor integration

1. Before sensor integration can be initiated it needs to be enabled. This step provisions required internal azure resources for sensor integration for Data Manager for Agriculture instance. This can be done by running below <a href="https://github.com/projectkudu/ARMClient" target=" blank">armclient</a> command.

```armclient 
armclient patch /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-instance-name>?api-version=2021-09-01-preview "{properties:{sensorIntegration:{enabled:'true'}}}"
```

Sample output:

```json
{
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-instance-name>",
  "type": "Microsoft.AgFoodPlatform/farmBeats",
  "sku": {
    "name": "A0"
  },
  "systemData": {
    "createdBy": "<customer-id>",
    "createdByType": "User",
    "createdAt": "2022-03-11T03:36:32Z",
    "lastModifiedBy": "<customer-id>",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2022-03-11T03:40:06Z"
  },
  "properties": {
    "instanceUri": "https://<farmbeats-instance-name>.farmbeats.azure.net/",
    "provisioningState": "Succeeded",
    "sensorIntegration": {
      "enabled": "True",
      "provisioningState": "**Creating**"
    },
    "publicNetworkAccess": "Enabled"
  },
  "location": "eastus",
  "name": "myfarmbeats"
}
```

2. The above job might take a few minutes to complete. To know the status of job, the below armclient command should be run

```armclient 
armclient get /subscriptions/<subscription-id>/resourceGroups/<resource-group-name> /providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-instance-name>?api-version=2021-09-01-preview
```

3. To verify whether it is completed, please look at the highlighted attribute below. It should be updated as “Succeeded” from “Creating” in the earlier step. Please note that the attribute which indicates that the sensor integration is enabled in indicated by **provisioningState inside the sensorIntegration object**. 

Sample output: 
```json
{
  "id": "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.AgFoodPlatform/farmBeats/<farmbeats-instance-name>",
  "type": "Microsoft.AgFoodPlatform/farmBeats",
  "sku": {
    "name": "A0"
  },
  "systemData": {
    "createdBy": "<customer-id>",
    "createdByType": "User",
    "createdAt": "2022-03-11T03:36:32Z",
    "lastModifiedBy": "<customer-id>",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2022-03-11T03:40:06Z"
  },
  "properties": {
    "instanceUri": "https://<customer-host-name>.farmbeats.azure.net/",
    "provisioningState": "Succeeded",
    "sensorIntegration": {
      "enabled": "True",
      "provisioningState": "**Succeeded**"
    },
    "publicNetworkAccess": "Enabled"
  },
  "tags": {
    "usage": "<sensor-partner-id>"
  },
  "location": "eastus",
  "name": "<customer-id>"
}
```
Once the provisioning status for sensor integration is completed, sensor integration objects can be created. 

## Step 4: Create integration object

Using the `SensorPartnerIntegrations` collection,  call into the SensorPartnerIntegrations_CreateOrUpdate API to create an integration object for a given sensor partner. The way to imagine the concept of integration is, every single customer of a sensor partner (Ex: Davis) will need to have an unique integration ID create in their Data Manager for Agriculture resource.

There are two different use cases that arises here

- If you (B2B Organization) are the owners of the sensors provided by the sensor partners, then you will be creating just one integration object (ID) for your account with sensor partner.

- If your end users (i.e. Farmers/Retailers/Agronomists) are the owners of the sensors provided by the sensor partners, then you will be creating an unique integration object (ID) for each end user. Because, each end user has their own accounts with the sensor partner.

API Endpoint: PATCH /sensor-partners/{sensorPartnerId}/integrations/{integrationID}


## Step 5: Generate consent link

Each integration is closely tied with a consent key. When integrating with sensor partners. Ex: In case of Davis, while providing the details on Data Manager for Agriculture integration in Davis [UI](https://weatherlink.github.io/azure-farmbeats/setup), there will be a section requesting for consent link. This consent link is way for sensor partners to validate if the end user (using the Davis portal) is actually a valid user of Data Manager for Agriculture.

Hence, sensor partners will call into the `check-consent` API endpoint to verify the users validity.

Therefore, to generate a consent link, you will need to use the `SensorPartnerIntegrations_GenerateConsentLink` API and provide the integration ID created from the previous step (3). As a response, you will be getting a string called consentLink. Which needs to be copied and provided to the sensor partner for further validation. If you are a customer of Davis Instruments, please follow this [page](https://weatherlink.github.io/azure-farmbeats/setup)

API Endpoint: PATCH /sensor-partners/{sensorPartnerId}/integrations/{integrationId}/:generate-consent-link


This step marks the completion of the sensor partner on-boarding from a customer perspective. Post this step, the sensor partners will have all the required information at their disposal to call into your API endpoints to create Sensor model, Device model, Sensors & Devices etc. This means, the partners will be able to push sensor events using the connection string generated for each sensor ID.

Therefore, the final step would be start consuming the sensor events being sent by the partners. But before consuming the events, you will need to create a mapping of each sensor ID to a specific Farmer ID & Boundary ID created in Data Manager for Agriculture.

## Step 6: Create sensor mapping

Using the `SensorMappings` collection, call into the `SensorMappings_CreateOrUpdate` API to create a mapping for each of the sensors for which you would be consuming the sensor events. Mapping is nothing but associating a sensor ID with a specific FarmerId and BoundaryId already present in the Data Manager for Agriculture system. This is done to ensure that as a platform you get to build data science models around a common boundary/farmer dimension. Because every other data source today (satellite, weather, farm operations etc.) are tied to a farmer & boundary. Hence, establishing this mapping object on a per sensor level will enable you to power all the agronomic use cases from a single pivot.

API Endpoint: PATCH /sensor-mappings/{sensorMappingId}


## Step 7: Consume sensor events

Using the `SensorEvents` collection, call into the `SensorEvents_List` API to consume all the sensor data that is being pushed by the respective sensor partner. To consume the sensor data, you will need to provide the following information

- sensorId (specifies for which sensor you want the data to be shown)
- sensorPartnerId (specifies which sensor partner is pushing this data)
- startDateTime & endDateTime (time range filters will ensure the data is slice to requested timeline)

API Endpoint: GET /sensor-events

