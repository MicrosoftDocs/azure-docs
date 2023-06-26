---
title: Sensor partner integration in Azure Data Manager for Agriculture
description: Provides guidance to set up your sensors as a partner
author: gourdsay
ms.author: angour
ms.service: data-manager-for-agri
ms.topic: how-to
ms.date: 06/19/2023
ms.custom: template-how-to
---

# Sensor partner integration flow

This document talks about the onboarding steps that a partner needs to take to  integrate with Data Manager for Agriculture. It presents an overview of the APIs used to create models & list sensor,  telemetry format to push the data and finally the IOTHub based data ingestion.

## Onboarding

Onboarding covers the steps required by both customers & partners to integrate with Data Manager for Agriculture and start receiving/sending sensor telemetry respectively.

:::image type="content" source="./media/sensor-partners-flow.png" alt-text="Screenshot showing sensor partners flow.":::

From the above figure, the blocks highlighted in white are the steps taken by a partner, and the ones highlighted in black are done by customers.

## Partner flow: Phase 1

Here's the set of steps that a partner needs to do for integrating with Data Manager for Agriculture. This is a one-time integration. At the end of phase 1, partners establish their identity in Data Manager for Agriculture.
  
### App creation

Partners need to be authenticated and authorized to access the Data Manager for Agriculture customers’ data plane APIs. Access to these APIs enables the partners to create sensor models, sensors & device objects within the customers’ Data Manager for Agriculture instance. The sensor object information (created by partner) is what is used by Data Manager for Agriculture to create respective devices (sensors) in IOTHub.

Hence to enable authentication & authorization, partners need to do the following

1. **Create an Azure account** (If you don't have one already created.)
2. **Create a multi-tenant Azure Active Directory app** - The multi-tenant Azure Active Directory app as the name signifies, has access to multiple customers’ tenants, if the customers have given explicit consent to the partner app (explained in the role assignment step).

Partners can access the APIs in customer tenant using the multi-tenant Azure Active Directory App, registered in Azure Active Directory. App registration is done on the Azure portal so the Microsoft identity platform can provide authentication and authorization services for your application that in turn accesses Data Manager for Agriculture.

Follow the steps provided in [App Registration](/azure/active-directory/develop/quickstart-register-app#register-an-application) **until the Step 8** to generate the following information:

1. **Application (client) ID**
2. **Directory (tenant) ID**
3. **App Name**

Copy and store all three values as you would need them for generating access token.

The Application (client) ID created is like the User ID of the application, and now you need to create its corresponding Application password (client secret) for the application to identify itself.

Follow the steps provided in [Add a client secret](/azure/active-directory/develop/quickstart-register-app#add-a-client-secret) to generate **Client Secret** and copy the client secret generated.

### Registration

Once the partner has created a multi-tenant Azure Active Directory app successfully, partners manually share the APP ID and Partner ID with Data Manager for Agriculture by emailing madma@microsoft.com alias. Using this information Data Manager for Agriculture validates if it’s an authentic partner and creating a partner identity (sensorPartnerId) using the internal APIs. As part of the registration process, partners are enabled to use their partner ID (sensorPartnerId) while creating the sensor/devices object and also as part of the sensor data that they push.

Getting the partner ID marks the completion of partner-Data Manager for Agriculture integration. Now, the partner waits for input from any of their sensor customers to initiate their data ingestion into Data Manager for Agriculture.

## Customer flow

Customers using Data Manager for Agriculture will be aware of all the supported sensor partners and their respective APP IDs. This information is available in the public documentation for all our customers.
Based on the sensors that customers use and their respective sensor partner’s APP ID, the customer has to provide access to the partner (APP ID) to start pushing their sensor data into their Data Manager for Agriculture instance. Here are the required steps:

### Role assignment

Customers who choose to onboard to a specific partner should have the app ID of that specific partner. Using the app ID customer needs to do the following things in sequence.

1. **Consent** – Since the partner’s app resides in a different tenant and the customer wants the partner to access certain APIs in their Data Manager for Agriculture instance, the customers are required to call a specific endpoint `https://login.microsoft.com/common/adminconsent/clientId=[client_id]` and replace the [client_id] with the partners’ app ID. This enables the customers’ Azure Active Directory to recognize this APP ID whenever they use it for role assignment.

2. **Identity Access Management (IAM)** – As part of Identity access management, customers create a new role assignment to the above app ID, which was provided consent. Data Manager for Agriculture creates a new role called Sensor Partner (In addition to the existing Admin, Contributor, Reader roles). Customers choose the sensor partner role and add the partner app ID and provide access.

### Initiation

The customer has made Data Manager for Agriculture aware that they need to get sensor data from a specific partner. However, the partner doesn’t yet know for which customer should they send the sensor data. Hence as a next step, the customer would call into integration API within Data Manager for Agriculture to generate an integration link. Post acquiring the integration link, customers would be sharing the below information in sequence, either manually sharing or using the partner’s portal.

1. **Consent link & Tenant ID** – In this step, the customer provides a consent link & tenant ID. The integration link looks like shown in the example:

    `fb-resource-name.farmbeats.com/sensor-partners/partnerId/integrations/IntegrationId/:check-consent?key=jgtHTFGDR?api-version=2021-07-31-preview`
    
    In addition to the consent link, customers would also provide a tenant ID. The tenant ID is used to fetch the access token required to call into the customer’s API endpoint.
    
    The partners validate the consent link by making a GET call on the check consent link API. As the link is fully prepopulated request URI as expected by Data Manager for Agriculture. As part of the GET call, the partners check for a 200 OK response code and IntegrationId to be passed in the response.

    Once the valid response is received, partners have to store two sets of information
    
    * API endpoint (can be extracted from the first part of the integration link)
    * IntegrationId (is returned as part of the response to GET call)
    
    Once partner validates and stores these data points, they can enable customers to add sensors for which the data has to be pushed into Data Manager for Agriculture.

2. **Add sensors/devices** – Now, the partner knows for which customer (API endpoint) do they need to integrate with, however, they still don’t know for which all sensors do they need to push the data. Hence, partners collect the sensor/device information for which the data needs to be pushed. This data can be collected either manually or through portal UI.

    Post adding the sensors/devices, the customer can expect the respective sensors’ data flow into their Data Manager for Agriculture instance. This step marks the completion of customer onboarding to fetch sensor data.

## Partner flow: Phase 2

Partner now has the information to call a specific API endpoint (Customers’ data plane), but they still don’t have the information on where do they need to push the sensor telemetry data?

### Integration

As part of integration, partners need to use their own app ID, app secret & customer’s tenant ID acquired during the app registration step, to generate an access token using the Microsoft’s oAuth API. Here's curl command to generate the access token

```azurepowershell
curl --location --request GET 'https://login.microsoftonline.com/<customer’s tenant ID> /oauth2/v2.0/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_secret=<Your app secret>' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=<Your app ID>' \
--data-urlencode 'scope=https://farmbeats.azure.net/.default'
```

The response should look like:

```json
{
  "token_type": "Bearer",
  "expires_in": "3599",
  "ext_expires_in": "3599",
  "expires_on": "1622530779",
  "not_before": "1622526879",
  "resource": "https://farmbeats.azure.net",
  "access_token": "eyJ0eXAiOiJKV1QiLC......tpZCI6InZhcF9"
}
```

With the generated access_token, partners call the customers’ data plane endpoint to create sensor model, sensor, and device. It's created in that specific Data Manager for Agriculture instance using the APIs built by Data Manager for Agriculture. For more information on partners APIs, refer to the [partner API documentation](/rest/api/data-manager-for-agri/dataplane-version2023-04-01-preview/sensor-partner-integrations).

As part of the sensor creation API, the partners provide the sensor ID, once the sensor resource is created, partners call into the get connection string API to get a connection string for that sensor.

### Push data

#### Create sensor partner integration
Create sensor partner integration to connect a particular party with a specific provider. The integrationId is later used in sensor creation.
API documentation: [Sensor Partner Integrations - Create Or Update](/rest/api/data-manager-for-agri/dataplane-version2023-04-01-preview/sensor-partner-integrations/create-or-update?tabs=HTTP)

#### Create sensor data model
Use sensor data model to define the model of telemetry being sent. All the telemetry sent by the sensor is validated as per this data model.

API documentation: [Sensor Data Models - Create Or Update](/rest/api/data-manager-for-agri/dataplane-version2023-04-01-preview/sensor-data-models/create-or-update?tabs=HTTP)

Sample telemetry 
```json
{
	"pressure": 30.45,
	"temperature": 28,
	"name": "sensor-1"
}
```

Corresponding sensor data model 
```json
{
  "type": "Sensor",
  "manufacturer": "Some sensor manufacturer",
  "productCode": "soil m",
  "measures": {
    "pressure": {
      "description": "measures soil moisture",
      "dataType": "Double",
      "type": "sm",
      "unit": "Bar",
      "properties": {
        "abc": "def",
        "elevation": 5
      }
    },
	"temperature": {
      "description": "measures soil temperature",
      "dataType": "Long",
      "type": "sm",
      "unit": "Celsius",
      "properties": {
        "abc": "def",
        "elevation": 5
      }
    },
	"name": {
      "description": "Sensor name",
      "dataType": "String",
      "type": "sm",
      "unit": "none",
      "properties": {
        "abc": "def",
        "elevation": 5
      }
    }
  },
  "sensorPartnerId": "sensor-partner-1",
  "id": "sdm124",
  "status": "new",
  "createdDateTime": "2022-01-24T06:12:15Z",
  "modifiedDateTime": "2022-01-24T06:12:15Z",
  "eTag": "040158a0-0000-0700-0000-61ee433f0000",
  "name": "my sdm for soil moisture",
  "description": "description goes here",
  "properties": {
    "key1": "value1",
    "key2": 123.45
  }
}
```

#### Create sensor
Create sensor using the corresponding integration ID and sensor data model ID. DeviceId and HardwareId are optional parameters, if needed, you can use the [Devices - Create Or Update](/rest/api/data-manager-for-agri/dataplane-version2023-04-01-preview/devices/create-or-update?tabs=HTTP) to create the device.

API documentation: [Sensors - Create Or Update](/rest/api/data-manager-for-agri/dataplane-version2023-04-01-preview/sensors/create-or-update?tabs=HTTP)

#### Get IoTHub connection string
Get IoTHub connection string to push sensor telemetry to the platform for the Sensor created. 

API Documentation: [Sensors - Get Connection String](/rest/api/data-manager-for-agri/dataplane-version2023-04-01-preview/sensors/get-connection-string)

#### Push Data using IoT Hub
Use [IoT Hub Device SDKs](/azure/iot-hub/iot-hub-devguide-sdks) to push the telemetry using the connection string.

For all sensor telemetry events, "timestamp" is a mandatory property and has to be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ).

Partner is now all set to start pushing sensor data for all sensors using the respective connection string provided for each sensor. However, the partner would be sending the sensor data in a JSON format as defined by FarmBeats. Refer to the telemetry schema provided here.

```json
{
	"timestamp": "2022-02-11T03:15:00Z",
	"bar": 30.181,
	"bar_absolute": 29.748,
	"bar_trend": 0,
	"et_day": 0.081,
	"humidity": 55,
	"rain_15_min": 0,
	"rain_60_min": 0,
	"rain_24_hr": 0,
	"rain_day": 0,
	"rain_rate": 0,
	"rain_storm": 0,
	"solar_rad": 0,
	"temp_out": 58.8,
	"uv_index": 0,
	"wind_dir": 131,
	"wind_dir_of_gust_10_min": 134,
	"wind_gust_10_min": 0,
	"wind_speed": 0,
	"wind_speed_2_min": 0,
	"wind_speed_10_min": 0
}
```

Once the data is pushed to IOTHub, the customers would be able to query sensor data using the egress API.

## Next steps

* Test our APIs [here](/rest/api/data-manager-for-agri).
