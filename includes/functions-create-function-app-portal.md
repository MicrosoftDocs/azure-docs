1. Click the **New** button found on the upper left-hand corner of the Azure portal.

1. Click **Compute** > **Function App**, select your **Subscription**. Then, use the function app settings as specified in the table.

    ![Create function app in the Azure portal](./media/functions-create-function-app-portal/function-app-create-flow.png)

    | Setting      | Suggested value  | Description                                        |
    | ------------ |  ------- | -------------------------------------------------- |
    | **App name** | Globally unique name | Name that identifies your new function app. | 
    | **[Resource Group](../articles/azure-resource-manager/resource-group-overview.md)** |  myResourceGroup | Name for the new resource group in which to create your function app. | 
    | **[Hosting plan](../articles/azure-functions/functions-scale.md)** |   Consumption plan | Hosting plan that defines how resources are allocated to your function app. In the default **Consumption Plan**, resources are added dynamically as required by your functions. You only pay for the time your functions run.   |
    | **Location** | West Europe | Choose a location near you or near other services your functions will access. |
    | **[Storage account](../articles/storage/storage-create-storage-account.md#create-a-storage-account)** |  Globally unique name |  Name of the new storage account used by your function app. You can also use an existing account. |

1. Click **Create** to provision and deploy the new function app.