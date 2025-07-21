---
title: Microsoft Azure Data Manager for Energy - How to enable legal tag creation for restricted country of origin data
description: "This article describes how to enable legal tag creation for restricted country of origin data."
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.topic: how-to #Don't change
ms.date: 02/08/2025

#customer intent: As a data manager, I need an ability to create legal tag definitions for restricted country of origin data.

---
# How to enable legal tag creation for OSDU&reg; restricted COO (Country of Origin) data?
Legal tag definitions represent the legal status of the data hosted on an Azure Data Manager for Energy resource. A valid legal tag is required for data ingestion and retrieval stored on the resource. See [How to manage legal tags](how-to-manage-legal-tags.md).

## COO (Country of Origin) configuration
The creation of legal tags is governed by a configuration hosted on each Azure Data Manager for Energy resource, defined in OSDU&reg; as the [legal service default configuration](https://community.opengroup.org/osdu/platform/security-and-compliance/legal/-/blob/master/legal-core/src/main/resources/DefaultCountryCode.json?ref_type=heads). This is a JSON configuration that defines data residency risk for data originating from these countries/regions using the parameter **residencyRisk** and the data types to which this risk status doesn't apply using the parameter **typesNotApplyDataResidency**. Below is a sample configuration for data originating from Australia as an example:

```json
{
    "name": "Australia",
    "alpha2": "AU",
    "numeric": 36,
    "residencyRisk": "No restriction",
    "typesNotApplyDataResidency": ["Transferred Data"]
}
```

The **residencyRisk** can take the values `default`, `Not Assigned`, `Embargoed`, and `No restriction`. For countries/regions configured as `No restriction`, creating legal tags and later data ingestion is allowed. However, for all other statuses, an attempt to create legal tags would fail.

For countries/regions with status as `default` and `Not Assigned`, the default configuration can be overridden by changing the residencyRisk to `client consent required` in a legal service configuration maintained in `Legal_COO.json`. This change in configuration is the recommended method to enable legal tags for restricted COO. As an example, Brazil’s default status doesn't allow the creation of legal tags for data ingestion with Brazil as the COO:

```json
{
  "name": "Brazil",
  "alpha2": "BR",
  "numeric": 76,
  "residencyRisk": "Default",
  "typesNotApplyDataResidency": ["Transferred Data"]
}
```

However, the configuration can be changed as below in the `Legal_COO.json` for the partition to allow the creation of legal tags:

```json
{
  "name": "Brazil",
  "alpha2": "BR",
  "numeric": 76,
  "residencyRisk": "Client consent required",
  "typesNotApplyDataResidency": ["Transferred Data"]
}
```

> [!NOTE]
> The configuration change is specific to the data partition in which the configuration is applied. Hence, these change requests require the reference of the data partition.

To enable this change, you should raise a support ticket on the Azure portal using the following information:
- Subscription ID
- Region in which the instance is deployed
- Azure Data Manager for Energy developer tier resource name
- Data partition name on which the configuration is to be changed.
- List of country/region specific configurations with new values to be applied (as shown above).

> [!TIP]
> Multiple partition configuration changes can be submitted in the same request by clearly specifying the partition name and the associated country/region specific configuration changes.

> [!NOTE]
> The country/region specific configuration can also be reversed to the original state of 'default' or 'Not Assigned' if the customer chooses.

> [!IMPORTANT]
> Microsoft isn't responsible for, and consults not or recommends changes to the **residencyRisk** status of country/region specific configurations. The customer, by making such a request to allow data from these countries/regions of origin by changing the configuration, is doing so at their own risk and understanding.

## Related content

* [Legal service](https://osdu.pages.opengroup.org/platform/security-and-compliance/legal/)
* [Allow data ingestion from specific country of origin](https://osdu.pages.opengroup.org/platform/security-and-compliance/legal/AllowDataIngestionFromCertainCOO/)
