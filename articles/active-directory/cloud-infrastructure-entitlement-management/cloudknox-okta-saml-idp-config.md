---
title: Use Okta as a SAML 2.0 identity provider (IDP) for Microsoft CloudKnox Permissions Management configuration
description: Use Okta as a SAML 2.0 identity provider (IDP) for Microsoft CloudKnox Permissions Management configuration.
services: active-directory
author: Yvonne-deQ
manager: karenh444
ms.service: active-directory
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 12/22/2021
ms.author: v-ydequadros
---

# Use Okta as a SAML 2.0 identity provider (IDP) for Microsoft CloudKnox Permissions Management configuration

You can federate authentication into the CloudKnox portal by using a Security Assertions Markup Language (SAML) 2.0 identity provider (IDP). When the IDP is configured, any user that enters their email address is redirected to the SAML Identity Provider for authentication. After the user is successfully authenticated, they're redirected to CloudKnox with a SAML assertion. This SAML assertion allows the user to access CloudKnox as an authorized user.

## Okta configuration video for CloudKnox Application

You can view the configuration process in the [Okta configuration for CloudKnox Application](https://www.loom.com/share/ab5c80bed6404b30893d8f9af848213e) video. This video doesn't contain a group attribute.

## Configure Okta as the SAML 2.0 identity provider

1. Log in to your Okta Portal as an Admin, and then select **Admin**.
2. Select **Applications**, then select **Add Application**.
3. Select **Create New App**.
4. In the **Create a New Application Integration** dialog, select **SAML 2.0**, and then select **Create**.
5. In the **General Settings** dialog, in the **App name** box, enter *CloudKnox*
6. In the **SAML Settings**, make the following specifications:

    1. In the **Single sign on URL** box, enter `https://app.cloudknox.io/saml/customerOrgId`

       Contact your Customer Success Engineer or Support team for your unique CloudKnox Organization ID to replace `customerOrgId` in the URL above.
    2. In the **Audience URI (SP Entity ID)** box, enter `https://app.cloudknox.io`
    3. In the **Name ID format** box, select **EmailAddress**.
    4. In the **Application username** box, select **Email**.
    5. In the **Update application username** box, select **Create and update**.

7. In **Attribute Statements (Optional)**, make the following selections.

    1. **Statement 1**:

        **Name: First_Name | Value: user.firstName**

    2. **Statement 2**:

        **Name: Last_Name | Value: user.lastName**

    3. **Statement 3**:

        **Name: Email_Address | Value: user.email**

    4. For the **Group Attribute**, make the following selections. 

        **Name: 'groups'**

        **Filter: Matches regex** 

        **Value**: .*

8. Scroll to the bottom of the page and select **Finish**.
9. Select **I'm an Okta customer adding an internal app**.
10. Select **View Setup Instructions**.
11. Copy the IDP metadata displayed under **Provide the following IDP metadata to your SP provider.**
12. Email the metadata you copied to your Customer Success Engineer.

    When your Customer Success Engineer receives the SAML IDP metadata, they process it and alert you when the change is live in your account. 

    Then, your users can log in through Okta.

## Set up the CloudKnox image as the Okta chiclet icon

If your administrator wants to add the CloudKnox image to your Okta portal as a chiclet icon, contact your Customer Success Engineer for the image.

<!---Next steps--->