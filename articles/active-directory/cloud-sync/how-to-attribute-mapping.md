---
title: 'Attribute mapping in Azure AD Connect cloud sync'
description: This article describes how to use the cloud sync feature of Azure AD Connect to map attributes.
services: active-directory
author: billmath
manager: mtillman
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/30/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Attribute mapping in Azure AD Connect cloud sync

You can use the cloud sync feature of Azure Active Directory (Azure AD) Connect to map attributes between your on-premises user or group objects and the objects in Azure AD. This capability has been added to the cloud sync configuration.

You can customize (change, delete, or create) the default attribute mappings according to your business needs. For a list of attributes that are synchronized, see [Attributes synchronized to Azure Active Directory](../hybrid/reference-connect-sync-attributes-synchronized.md?context=azure%2factive-directory%2fcloud-provisioning%2fcontext%2fcp-context/hybrid/reference-connect-sync-attributes-synchronized.md).

> [!NOTE]
> This article describes how to use the Azure portal to map attributes.  For information on using Microsoft Graph, see [Transformations](how-to-transformation.md).

## Understand types of attribute mapping
With attribute mapping, you control how attributes are populated in Azure AD. Azure AD supports four mapping types:

|Mapping Type|Description|
|-----|-----|
|**Direct**|The target attribute is populated with the value of an attribute of the linked object in Active Directory.|
|**Constant**|The target attribute is populated with a specific string that you specify.|
|**Expression**|The target attribute is populated based on the result of a script-like expression. For more information, see [Expression Builder](how-to-expression-builder.md) and [Writing expressions for attribute mappings in Azure Active Directory](reference-expressions.md).|
|**None**|The target attribute is left unmodified. However, if the target attribute is ever empty, it's populated with the default value that you specify.|

Along with these basic types, custom attribute mappings support the concept of an optional *default* value assignment. The default value assignment ensures that a target attribute is populated with a value if Azure AD or the target object doesn't have a value. The most common configuration is to leave this blank.

## Schema updates and mappings
Cloud sync will occasionally update the schema and the list of default attributes that are [synchronized](../hybrid/reference-connect-sync-attributes-synchronized.md?context=%2fazure%2factive-directory%2fcloud-provisioning%2fcontext%2fcp-context).  These default attribute mappings will be available for new installations but will not automatically be added to existing installations.  To add these mappings you can follow the steps below.


  1. Click on “add attribute mapping”
  2. Select the Target attribute dropdown
  3. You should see the new attributes that are available here.

The following is a list of new mappings that were added.

Attribute Added | Mapping Type | Added with Agent Version
| ----- | -----| -----|
|preferredDatalocation|Direct|1.1.359.0|
|EmployeeNumber|Direct|1.1.359.0|
|UserType|Direct|1.1.359.0|

For more information on how to map UserType, see [Map UserType with cloud sync](how-to-map-usertype.md).

## Understand properties of attribute mappings

Along with the type property, attribute mappings support certain attributes.  These attributes will depend on the type of mapping you have selected.  The following sections describe the supported attribute mappings for each of the individual types

### Direct mapping attributes
The following are the attributes supported by a direct mapping:

- **Source attribute**: The user attribute from the source system (example: Active Directory).
- **Target attribute**: The user attribute in the target system (example: Azure Active Directory).
- **Default value if null (optional)**: The value that will be passed to the target system if the source attribute is null. This value will be provisioned only when a user is created. It won't be provisioned when you're updating an existing user.  
- **Apply this mapping**:
  - **Always**: Apply this mapping on both user-creation and update actions.
  - **Only during creation**: Apply this mapping only on user-creation actions.

 ![Screenshot for direct](media/how-to-attribute-mapping/mapping-7.png)

### Constant mapping attributes
The following are the attributes supported by a constant mapping:

- **Constant value**: The value that you want to apply to the target attribute.
- **Target attribute**: The user attribute in the target system (example: Azure Active Directory).
- **Apply this mapping**:
  - **Always**: Apply this mapping on both user-creation and update actions.
  - **Only during creation**: Apply this mapping only on user-creation actions.

 ![Screenshot for constant](media/how-to-attribute-mapping/mapping-9.png)

### Expression mapping attributes
The following are the attributes supported by an expression mapping:

- **Expression**: This is the expression that is going to be applied to the target attribute.  For more information, see [Expression Builder](how-to-expression-builder.md) and [Writing expressions for attribute mappings in Azure Active Directory](reference-expressions.md).
-  **Default value if null (optional)**: The value that will be passed to the target system if the source attribute is null. This value will be provisioned only when a user is created. It won't be provisioned when you're updating an existing user. 
- **Target attribute**: The user attribute in the target system (example: Azure Active Directory).
 
- **Apply this mapping**:
  - **Always**: Apply this mapping on both user-creation and update actions.
  - **Only during creation**: Apply this mapping only on user-creation actions.

 ![Screenshot for expression](media/how-to-attribute-mapping/mapping-10.png)

## Add an attribute mapping

To use the new capability, follow these steps:

1.  In the Azure portal, select **Azure Active Directory**.
2.  Select **Azure AD Connect**.
3.  Select **Manage cloud sync**.

    ![Screenshot that shows the link for managing cloud sync.](media/how-to-install/install-6.png)

4. Under **Configuration**, select your configuration.
5. Select **Click to edit mappings**.  This link opens the **Attribute mappings** screen.

    ![Screenshot that shows the link for adding attributes.](media/how-to-attribute-mapping/mapping-6.png)

6.  Select **Add attribute**.

    ![Screenshot that shows the button for adding an attribute, along with lists of attributes and mapping types.](media/how-to-attribute-mapping/mapping-1.png)

7. Select the mapping type. This can be one of the following:
     - **Direct**: The target attribute is populated with the value of an attribute of the linked object in Active Directory.
     - **Constant**: The target attribute is populated with a specific string that you specify.
     - **Expression**: The target attribute is populated based on the result of a script-like expression. 
     - **None**: The target attribute is left unmodified. 
 
     For more information see See [Understanding attribute types](#understand-types-of-attribute-mapping) above.
8. Depending on what you have selected in the previous step, different options will be available for filling in.  See the [Understand properties of attribute mappings](#understand-properties-of-attribute-mappings)sections above for information on these attributes.
9. Select when to apply this mapping, and then select **Apply**.
11. Back on the **Attribute mappings** screen, you should see your new attribute mapping.  
12. Select **Save schema**.

    ![Screenshot that shows the Save schema button.](media/how-to-attribute-mapping/mapping-3.png)

## Test your attribute mapping

To test your attribute mapping, you can use [on-demand provisioning](how-to-on-demand-provision.md): 

1. In the Azure portal, select **Azure Active Directory**.
2. Select **Azure AD Connect**.
3. Select **Manage provisioning**.
4. Under **Configuration**, select your configuration.
5. Under **Validate**, select the **Provision a user** button. 
6. On the **Provision on demand** screen, enter the distinguished name of a user or group and select the **Provision** button. 

   The screen shows that the provisioning is in progress.

   ![Screenshot that shows provisioning in progress.](media/how-to-attribute-mapping/mapping-4.png)

8. After provisioning finishes, a success screen appears with four green check marks. 

   Under **Perform action**, select **View details**. On the right, you should see the new attribute synchronized and the expression applied.

   ![Screenshot that shows success and export details.](media/how-to-attribute-mapping/mapping-5.png)






## Next steps

- [What is Azure AD Connect cloud sync?](what-is-cloud-sync.md)
- [Writing expressions for attribute mappings](reference-expressions.md)
- [How to use expression builder with cloud sync](how-to-expression-builder.md)
- [Attributes synchronized to Azure Active Directory](../hybrid/reference-connect-sync-attributes-synchronized.md?context=azure%2factive-directory%2fcloud-provisioning%2fcontext%2fcp-context/hybrid/reference-connect-sync-attributes-synchronized.md)