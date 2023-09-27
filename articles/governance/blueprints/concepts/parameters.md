---
title: Use parameters to creating dynamic blueprints
description: Learn about static and dynamic parameters and how to use them to create secure and dynamic blueprints.
ms.date: 09/07/2023
ms.topic: conceptual
---
# Creating dynamic blueprints through parameters

[!INCLUDE [Blueprints deprecation note](../../../../includes/blueprints-deprecation-note.md)]

A fully defined blueprint with various artifacts such as resource groups, Azure Resource Manager
templates (ARM templates), policies, or role assignments, offers the rapid creation and consistent
creation of objects within Azure. To enable flexible use of these reusable design patterns and
containers, Azure Blueprints supports parameters. The parameter creates flexibility, both during
definition and assignment, to change properties on the artifacts deployed by the blueprint.

A simple example is the resource group artifact. When a resource group is created, it has two
required values that must be provided: name and location. When adding a resource group to your
blueprint, if parameters didn't exist, you would define that name and location for every use of the
blueprint. This repetition would cause every use of the blueprint to create artifacts in the same
resource group. Resources inside that resource group would become duplicated and cause a conflict.

> [!NOTE]
> It isn't an issue for two different blueprints to include a resource group with the same name.
> If a resource group included in a blueprint already exists, the blueprint continues to create the
> related artifacts in that resource group. This could cause a conflict as two resources with the
> same name and resource type cannot exist within a subscription.

The solution to this problem is parameters. Azure Blueprints allows you to define the value for each
property of the artifact during assignment to a subscription. The parameter makes it possible to
reuse a blueprint that creates a resource group and other resources within a single subscription
without having conflict.

## Blueprint parameters

Through the REST API, parameters can be created on the blueprint itself. These parameters are
different than the parameters on each of the supported artifacts. When a parameter is created on the
blueprint, it can be used by the artifacts in that blueprint. An example might be the prefix for
naming of the resource group. The artifact can use the blueprint parameter to create a "mostly
dynamic" parameter. As the parameter can also be defined during assignment, this pattern allows for
a consistency that may adhere to naming rules. For steps, see [setting static parameters - blueprint
level parameter](#blueprint-level-parameter).

### Using secureString and secureObject parameters

While an ARM template _artifact_ supports parameters of the **secureString** and **secureObject**
types, Azure Blueprints requires each to be connected with an Azure Key Vault. This security measure
prevents the unsafe practice of storing secrets along with the Blueprint and encourages employment
of secure patterns. Azure Blueprints supports this security measure, detecting the inclusion of
either secure parameter in an ARM template _artifact_. The service then prompts during assignment
for the following Key Vault properties per detected secure parameter:

- Key Vault resource ID
- Key Vault secret name
- Key Vault secret version

If the blueprint assignment uses a **system-assigned managed identity**, the referenced Key Vault
_must_ exist in the same subscription the blueprint definition is assigned to.

If the blueprint assignment uses a **user-assigned managed identity**, the referenced Key Vault
_may_ exist in a centralized subscription. The managed identity must be granted appropriate rights
on the Key Vault prior to blueprint assignment.

> [!IMPORTANT]
> In both cases, the Key Vault must have **Enable access to Azure Resource Manager for template
> deployment** configured on the **Access policies** page. For directions on how to enable this
> feature, see [Key Vault - Enable template
> deployment](../../../azure-resource-manager/managed-applications/key-vault-access.md#enable-template-deployment).

For more information about Azure Key Vault, see [Key Vault
Overview](../../../key-vault/general/overview.md).

## Parameter types

### Static parameters

A parameter value defined in the definition of a blueprint is called a **static parameter**, because
every use of the blueprint will deploy the artifact using that static value. In the resource group
example, while it doesn't make sense for the name of the resource group, it might make sense for the
location. Then, every assignment of the blueprint would create the resource group, whatever it's
called during assignment, in the same location. This flexibility allows you to be selective in what
you define as required vs what can be changed during assignment.

#### Setting static parameters in the portal

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select **Blueprint definitions** from the page on the left.

1. Select an existing blueprint and then select **Edit blueprint** OR select **+ Create blueprint**
   and fill out the information on the **Basics** tab.

1. Select **Next: Artifacts** OR select the **Artifacts** tab.

1. Artifacts added to the blueprint that have parameter options display **X of Y parameters
   populated** in the **Parameters** column. Select the artifact row to edit the artifact
   parameters.

   :::image type="content" source="../media/parameters/parameter-column.png" alt-text="Screenshot of a blueprint definition and the 'X of Y parameters populated' highlighted." border="false":::

1. The **Edit Artifact** page displays value options appropriate to the artifact selected. Each
   parameter on the artifact has a title, a value box, and a checkbox. Set the box to unchecked to
   make it a **static parameter**. In the following example, only _Location_ is a **static
   parameter** as it's unchecked and _Resource Group Name_ is checked.

   :::image type="content" source="../media/parameters/static-parameter.png" alt-text="Screenshot of static parameters on a blueprint artifact." border="false":::

#### Setting static parameters from REST API

In each REST API URI, there are variables that are used that you need to replace with your own values:

- `{YourMG}` - Replace with the name of your management group
- `{subscriptionId}` - Replace with your subscription ID

##### Blueprint level parameter

When creating a blueprint through REST API, it's possible to create [blueprint
parameters](#blueprint-parameters). To do so, use the following REST API URI and body format:

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint?api-version=2018-11-01-preview
  ```

- Request Body

  ```json
  {
      "properties": {
          "description": "This blueprint has blueprint level parameters.",
          "targetScope": "subscription",
          "parameters": {
              "owners": {
                  "type": "array",
                  "metadata": {
                      "description": "List of AAD object IDs that is assigned Owner role at the resource group"
                  }
              }
          },
          "resourceGroups": {
              "storageRG": {
                  "description": "Contains the resource template deployment and a role assignment."
              }
          }
      }
  }
  ```

Once a blueprint level parameter is created, it can be used on artifacts added to that blueprint.
The following REST API example creates a role assignment artifact on the blueprint and uses the
blueprint level parameter.

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/roleOwner?api-version=2018-11-01-preview
  ```

- Request Body

  ```json
  {
      "kind": "roleAssignment",
      "properties": {
          "resourceGroup": "storageRG",
          "roleDefinitionId": "/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
          "principalIds": "[parameters('owners')]"
      }
  }
  ```

In this example, the **principalIds** property uses the **owners** blueprint level parameter by
using a value of `[parameters('owners')]`. Setting a parameter on an artifact using a blueprint
level parameter is still an example of a **static parameter**. The blueprint level parameter can't
be set during blueprint assignment and will be the same value on each assignment.

##### Artifact level parameter

Creating **static parameters** on an artifact is similar, but takes a straight value instead of
using the `parameters()` function. The following example creates two static parameters, **tagName**
and **tagValue**. The value on each is directly provided and doesn't use a function call.

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/policyStorageTags?api-version=2018-11-01-preview
  ```

- Request Body

  ```json
  {
      "kind": "policyAssignment",
      "properties": {
          "description": "Apply storage tag and the parameter also used by the template to resource groups",
          "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/49c88fc8-6fd1-46fd-a676-f12d1d3a4c71",
          "parameters": {
              "tagName": {
                  "value": "StorageType"
              },
              "tagValue": {
                  "value": "Premium_LRS"
              }
          }
      }
  }
  ```

### Dynamic parameters

The opposite of a static parameter is a **dynamic parameter**. This parameter isn't defined on the
blueprint, but instead is defined during each assignment of the blueprint. In the resource group
example, use of a **dynamic parameter** makes sense for the resource group name. It provides a
different name for every assignment of the blueprint. For a list of blueprint functions, see the
[blueprint functions](../reference/blueprint-functions.md) reference.

#### Setting dynamic parameters in the portal

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select **Blueprint definitions** from the page on the left.

1. Right-click on the blueprint that you want to assign. Select **Assign blueprint** OR select the
   blueprint you want to assign, then use the **Assign blueprint** button.

1. On the **Assign blueprint** page, find the **Artifact parameters** section. Each artifact with at
   least one **dynamic parameter** displays the artifact and the configuration options. Provide
   required values to the parameters before assigning the blueprint. In the following example,
   _Name_ is a **dynamic parameter** that must be defined to complete blueprint assignment.

   :::image type="content" source="../media/parameters/dynamic-parameter.png" alt-text="Screenshot of setting dynamic parameters during blueprint assignment." border="false":::

#### Setting dynamic parameters from REST API

Setting **dynamic parameters** during the assignment is done by entering the value directly. Instead
of using a function, such as [parameters()](../reference/blueprint-functions.md#parameters), the
value provided is an appropriate string. Artifacts for a resource group are defined with a "template
name", **name**, and **location** properties. All other parameters for included artifact are defined
under **parameters** with a **\<name\>** and **value** key pair. If the blueprint is configured for
a dynamic parameter that isn't provided during assignment, the assignment will fail.

- REST API URI

  ```http
  PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Blueprint/blueprintAssignments/assignMyBlueprint?api-version=2018-11-01-preview
  ```

- Request Body

  ```json
  {
      "properties": {
          "blueprintId": "/providers/Microsoft.Management/managementGroups/{YourMG}  /providers/Microsoft.Blueprint/blueprints/MyBlueprint",
          "resourceGroups": {
              "storageRG": {
                  "name": "StorageAccount",
                  "location": "eastus2"
              }
          },
          "parameters": {
              "storageAccountType": {
                  "value": "Standard_GRS"
              },
              "tagName": {
                  "value": "CostCenter"
              },
              "tagValue": {
                  "value": "ContosoIT"
              },
              "contributors": {
                  "value": [
                      "7be2f100-3af5-4c15-bcb7-27ee43784a1f",
                      "38833b56-194d-420b-90ce-cff578296714"
                  ]
                },
              "owners": {
                  "value": [
                      "44254d2b-a0c7-405f-959c-f829ee31c2e7",
                      "316deb5f-7187-4512-9dd4-21e7798b0ef9"
                  ]
              }
          }
      },
      "identity": {
          "type": "systemAssigned"
      },
      "location": "westus"
  }
  ```

## Next steps

- See the list of [blueprint functions](../reference/blueprint-functions.md).
- Learn about the [blueprint lifecycle](./lifecycle.md).
- Learn to customize the [blueprint sequencing order](./sequencing-order.md).
- Find out how to make use of [blueprint resource locking](./resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
- Resolve issues during the assignment of a blueprint with
  [general troubleshooting](../troubleshoot/general.md).
