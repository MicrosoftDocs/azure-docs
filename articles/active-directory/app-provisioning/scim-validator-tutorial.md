---
title: Tutorial - Test your SCIM endpoint for compatibility with the Azure Active Directory (Azure AD) provisioning service.
description: This tutorial describes how to use the Azure AD SCIM Validator to validate that your provisioning server is compatible with the Azure SCIM client.
author: kenwith
ms.author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: tutorial
ms.date: 09/13/2022
ms.custom: template-tutorial
ms.reviewer: arvinh
---


# Tutorial: Validate a SCIM endpoint

This tutorial describes how to use the Azure AD SCIM Validator to validate that your provisioning server is compatible with the Azure SCIM client. The tutorial is intended for developers who want to build a SCIM compatible server to manage their identities.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Select a testing method
> * Configure the testing method
> * Validate your SCIM endpoint

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A SCIM endpoint that conforms to the SCIM 2.0 standard and meets the provision service requirements. To learn more, see [Tutorial: Develop and plan provisioning for a SCIM endpoint in Azure Active Directory](use-scim-to-provision-users-and-groups.md).


## Select a testing method
The first step is to select a testing method to validate your SCIM endpoint.

1. Open your web browser and navigate to the SCIM Validator: [https://scimvalidator.microsoft.com/](https://scimvalidator.microsoft.com/).
1. Select one of the three test options. You can use default attributes, automatically discover the schema, or upload a schema.

:::image type="content" source="./media/scim-validator-tutorial/scim-validator.png" alt-text="SCIM Validator Main Page" lightbox="./media/scim-validator-tutorial/scim-validator.png":::

**Use default attributes** - The system provides the default attributes, and you modify them to meet your need.

**Discover schema** - If your end point supports /Schema, this option will allow the tool to discover the supported attributes. We recommend this option as it reduces the overhead of updating your app as you build it out.

**Upload Azure AD Schema** - Upload the schema you've downloaded from your sample app on Azure AD.


## Configure the testing method
Now that you've selected a testing method, the next step is to configure it.

1. If you're using the default attributes option, then fill in all of the indicated fields. Ensure that the *Enable group tests* option is checked if the desire is to test group attributes as well. 
2. If you're using the discover schema option, then enter the SCIM endpoint URL and token.
3. If you're uploading a schema, then select your .json file to upload. The option accepts a .json file exported from your sample app on the Azure portal. To learn how to export a schema, see [How-to: Export provisioning configuration and roll back to a known good state](export-import-provisioning-configuration.md#export-your-provisioning-configuration). 
> [!NOTE]
> To test *group attributes*, make sure to select **Enable Group Tests**.

4. Edit the list attributes as desired for both the user and group types using the ‘Add Attribute’ option at the end of the attribute list and minus (-) sign on the right side of the page. 
5. Select the joining property from both the user and group attributes list. 
> [!NOTE]
> The joining property, also known as matching attribute, is an attribute that user and group resources can be uniquely queried on at the source and matched in the target system.

:::image type="content" source="./media/scim-validator-attributes/scim-validator-results.png" alt-text="SCIM Validator Attributes Page" lightbox="./media/scim-validator-tutorial/scim-validator-attributes.png":::

## Validate your SCIM endpoint
Finally, you need to test and validate your endpoint.

1. Select **Test Schema** to begin the test.
1. Review the results with a summary of passed and failed tests.
1. Select the **show details** tab and review and fix issues.
1. Continue to test your schema until all tests pass.


:::image type="content" source="./media/scim-validator-tutorial/scim-validator-results.png" alt-text="SCIM Validator Results Page" lightbox="./media/scim-validator-tutorial/scim-validator-results.png":::

## Clean up resources

Don't forget to delete any Azure resources that you no longer need.

## Known issues 

- Deletes aren't yet supported.
- The time zone format is randomly generated and will fail for systems that try to validate it.
- The preferred language format is randomly generated and will fail for systems that try to validate it.
- The patch user remove attributes may attempt to remove mandatory/required attributes for certain systems. Such failures should be ignored.


## Next steps

Learn how to customize user provisioning attribute-mappings for SaaS applications in Azure Active Directory.
> [!div class="nextstepaction"]
> [Learn how to customize application attributes](customize-application-attributes.md)
