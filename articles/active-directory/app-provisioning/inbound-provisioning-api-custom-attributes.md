---
title: Extend API-driven provisioning to sync custom attributes
description: Learn how to extend API-driven inbound provisioning to sync custom attributes.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: how-to
ms.date: 07/24/2023
ms.author: jfields
ms.reviewer: cmmdesai
---

# Extend API-driven provisioning to sync custom attributes (Public preview)

By default, API-driven provisioning apps support processing attributes that are part of the standard SCIM Core User and Enterprise User schema. Your system of record may have custom attributes that you may want to include as part of API-driven provisioning. This advanced tutorial describes how to extend your API-driven provisioning app to process additional custom attributes. 

> [!NOTE]
> Before trying this advanced scenario, we recommend verifying that your out-of-the-box provisioning app configuration works as expected using one of the following API clients [Graph Explorer](inbound-provisioning-api-graph-explorer.md), [cURL](inbound-provisioning-api-curl-tutorial.md) or [Postman](inbound-provisioning-api-postman.md).

## Example scenario

You have configured API-driven provisioning app. You're provisioning app is successfully consuming the attributes that are part of the standard SCIM Core User and Enterprise User schema and provisioning users in Azure AD. You now want to send two custom attributes `HireDate` and `JobCode` from your HR system to the inbound provisioning API endpoint. You'd like to map these two custom attributes to Azure AD attributes `employeeHireDate` and `jobTitle`.

## Step 1 - Extend the provisioning app schema

In this step, we'll add the two attributes "HireDate" and "JobCode" that are not part of the standard SCIM schema to the provisioning app and use them in the provisioning data flow.

1. Log in to Microsoft Entra portal with application administrator role.
1. Go to **Enterprise applications** and open your API-driven provisioning app. 
1. Open the **Provisioning** blade. 
1. Click on the **Edit Provisioning** button. 
1. Expand the **Mappings** section and click on the attribute mapping link. <br>
    :::image type="content" border="true" source="./media/inbound-provisioning-api-custom-attributes/edit-attribute-mapping.png" alt-text="Screenshot of edit attribute mapping." lightbox="./media/inbound-provisioning-api-custom-attributes/edit-attribute-mapping.png":::
1. Scroll down the **Attribute Mappings** page. Select **Show advanced options** and click on the **Edit attribute list for API** link.
    :::image type="content" border="true" source="./media/inbound-provisioning-api-custom-attributes/edit-api-attribute-list.png" alt-text="Screenshot of edit API attribute list." lightbox="./media/inbound-provisioning-api-custom-attributes/edit-api-attribute-list.png":::
1. Scroll down to the end of the **Edit Attribute List** page.
1. Add the following two attributes to the list as SCIM schema extensions. You can use your own SCIM schema namespace. <br>
   `urn:ietf:params:scim:schemas:extension:contoso:1.0:User:HireDate` <br>
   `urn:ietf:params:scim:schemas:extension:contoso:1.0:User:JobCode` <br>
    :::image type="content" border="true" source="./media/inbound-provisioning-api-custom-attributes/add-custom-attributes.png" alt-text="Screenshot of adding custom attributes." lightbox="./media/inbound-provisioning-api-custom-attributes/add-custom-attributes.png":::
1.  **Save** your changes

> [!NOTE]
> If you'd like to add only a few additional attributes to the provisioning app, use Microsoft Entra Portal to extend the schema. If you'd like to add more custom attributes (let's say 20+ attributes), then we recommend using the [`UpdateSchema` mode of the CSV2SCIM PowerShell script](inbound-provisioning-api-powershell.md#extending-provisioning-job-schema) which automates the above manual process.

## Step 2 - Map the custom attributes

Let's now add these extensions to the provisioning app attribute mapping. 

1. Click on the **Add New Mapping** link on the **Attribute mapping** page. 
    :::image type="content" border="true" source="./media/inbound-provisioning-api-custom-attributes/add-new-mapping.png" alt-text="Screenshot of add new mapping." lightbox="./media/inbound-provisioning-api-custom-attributes/add-new-mapping.png":::
1. Map the `urn:ietf:params:scim:schemas:extension:contoso:1.0:User:HireDate` attribute to `employeeHireDate`. Click **OK**. <br>
    :::image type="content" border="true" source="./media/inbound-provisioning-api-custom-attributes/hire-date-mapping.png" alt-text="Screenshot of hire date mapping." lightbox="./media/inbound-provisioning-api-custom-attributes/hire-date-mapping.png":::
1. Next, select the existing mapping for `title` and click on it to edit the mapping.
1. Edit the attribute mapping to an expression that will include the `urn:ietf:params:scim:schemas:extension:contoso:1.0:User:JobCode` as part of the `jobTitle` Azure AD attribute.
   ```
     Join("", [title], "(", [urn:ietf:params:scim:schemas:extension:contoso:1.0:User:JobCode], ")")
   ```
    :::image type="content" border="true" source="./media/inbound-provisioning-api-custom-attributes/job-title-mapping.png" alt-text="Screenshot of job title mapping." lightbox="./media/inbound-provisioning-api-custom-attributes/job-title-mapping.png":::

    With this expression mapping, if the `title` is "Tour Lead"  and  `JobCode`is "TL-1001", then the Azure AD attribute `jobTitle` will be set to "Tour Lead (TL-1001)". 
1. Save the attribute mappings. 

## Step 3 - Upload bulk request with custom attributes

1. Open your API client (Graph Explorer / Postman / cURL). 
1. Copy-paste the [bulk request with custom attributes](#bulk-request-with-custom-attributes). 
1. Send the bulk request to your provisioning API endpoint URL. <br>
    :::image type="content" border="true" source="./media/inbound-provisioning-api-custom-attributes/upload-bulk-request.png" alt-text="Screenshot of bulk upload request." lightbox="./media/inbound-provisioning-api-custom-attributes/upload-bulk-request.png":::
1. After some time, you can check the provisioning logs to verify the attribute change. <br>
    :::image type="content" border="true" source="./media/inbound-provisioning-api-custom-attributes/verify-provisioning-logs.png" alt-text="Screenshot of provisioning logs." lightbox="./media/inbound-provisioning-api-custom-attributes/verify-provisioning-logs.png":::
1. You can also verify the change in the Azure AD user profile. The value for `Employee hire date` reflects your tenant time zone. <br>
    :::image type="content" border="true" source="./media/inbound-provisioning-api-custom-attributes/verify-user-profile.png" alt-text="Screenshot of user profile." lightbox="./media/inbound-provisioning-api-custom-attributes/verify-user-profile.png":::

## Appendix

### Bulk request with custom attributes

The bulk request includes the custom attributes configured in the steps above. 

**Request body**
```http
{
    "schemas": ["urn:ietf:params:scim:api:messages:2.0:BulkRequest"],
    "Operations": [
    {
        "method": "POST",
        "bulkId": "701984",
        "path": "/Users",
        "data": {
            "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User",
            "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
            "urn:ietf:params:scim:schemas:extension:contoso:1.0:User"],
            "externalId": "701984",
            "userName": "bjensen@example.com",
            "name": {
                "formatted": "Ms. Barbara J Jensen, III",
                "familyName": "Jensen",
                "givenName": "Barbara",
                "middleName": "Jane",
                "honorificPrefix": "Ms.",
                "honorificSuffix": "III"
            },
            "displayName": "Babs Jensen",
            "nickName": "Babs",
            "emails": [
            {
              "value": "bjensen@example.com",
              "type": "work",
              "primary": true
            }
            ],
            "addresses": [
            {
              "type": "work",
              "streetAddress": "234300 Universal City Plaza",
              "locality": "Hollywood",
              "region": "CA",
              "postalCode": "91608",
              "country": "USA",
              "formatted": "100 Universal City Plaza\nHollywood, CA 91608 USA",
              "primary": true
            }
            ],
            "phoneNumbers": [
            {
              "value": "555-555-5555",
              "type": "work"
            }
            ],
            "userType": "Employee",
            "title": "Tour Guide",
            "preferredLanguage": "en-US",
            "locale": "en-US",
            "timezone": "America/Los_Angeles",
            "active":true,
            "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
                "employeeNumber": "701984",
                "costCenter": "4130",
                "organization": "Universal Studios",
                "division": "Theme Park",
                "department": "Tour Operations",
                "manager": {
                  "value": "89607",
                  "displayName": "John Smith"
                 }
            },
            "urn:ietf:params:scim:schemas:extension:contoso:1.0:User": {
                "HireDate": "2021-05-01T00:00:00-05:00",
                "JobCode": "TG-1001"
            }            
        }
    },
    {
        "method": "POST",
        "bulkId": "701985",
        "path": "/Users",
        "data": {
            "schemas": ["urn:ietf:params:scim:schemas:core:2.0:User",
            "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
            "urn:ietf:params:scim:schemas:extension:contoso:1.0:User"],
            "externalId": "701985",
            "userName": "Kjensen@example.com",
            "name": {
                "formatted": "Ms. Kathy J Jensen, III",
                "familyName": "Jensen",
                "givenName": "Kathy",
                "middleName": "Jane",
                "honorificPrefix": "Ms.",
                "honorificSuffix": "III"
            },
            "displayName": "Kathy Jensen",
            "nickName": "Kathy",
            "emails": [
            {
              "value": "kjensen@example.com",
              "type": "work",
              "primary": true
            }
            ],
            "addresses": [
            {
              "type": "work",
              "streetAddress": "100 Oracle City Plaza",
              "locality": "Hollywood",
              "region": "CA",
              "postalCode": "91618",
              "country": "USA",
              "formatted": "100 Oracle City Plaza\nHollywood, CA 91618 USA",
              "primary": true
            }
            ],
            "phoneNumbers": [
            {
              "value": "555-555-5545",
              "type": "work"
            }
            ],
            "userType": "Employee",
            "title": "Tour Lead",
            "preferredLanguage": "en-US",
            "locale": "en-US",
            "timezone": "America/Los_Angeles",
            "active":true,
            "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
              "employeeNumber": "701984",
              "costCenter": "4130",
              "organization": "Universal Studios",
              "division": "Theme Park",
              "department": "Tour Operations",
              "manager": {
                "value": "701984",
                "displayName": "Barbara Jensen"
             }
            },
            "urn:ietf:params:scim:schemas:extension:contoso:1.0:User": {
                "HireDate": "2022-07-15T00:00:00-05:00",
                "JobCode": "TL-1003"
            }            
        }
    }
],
    "failOnErrors": null
}
```

## Next steps

- [Troubleshoot issues with the inbound provisioning API](inbound-provisioning-api-issues.md)
- [Frequently asked questions about API-driven inbound provisioning](inbound-provisioning-api-faqs.md)
- [Quick start using PowerShell](inbound-provisioning-api-powershell.md)
- [Quick start using Azure Logic Apps](inbound-provisioning-api-logic-apps.md)
