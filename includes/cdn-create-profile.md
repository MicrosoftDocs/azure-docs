## Create a new CDN profile

1. In the [Azure portal](https://portal.azure.com), in the upper left, select **Create a resource**.
    
    The **New** pane appears.
   
2. In the **New** pane, select **Web + Mobile**, then **CDN**.
   
    ![Select CDN resource](./media/cdn-create-profile/cdn-new-resource.png)

    The **CDN profile** pane appears.

    Use the settings specified in the table following the image.
   
    ![New CDN profile](./media/cdn-create-profile/cdn-new-profile.png)

    | Setting | Suggested value | Description |
    | ------- | --------------- | ----------- |
    | **Name** | Enter a name for the new CDN profile. | Each profile name must be unique.|
    | **Subscription** | Select the subscription to use for this CDN profile. | The available subscriptions are accessed from the drop-down list.|
    | **Resource group** | Enter a unique name for the resource group. | Any available resource groups are accessed from the drop-down list. For information about resource groups, see [Azure Resource Manager overview](../articles/azure-resource-manager/resource-group-overview.md#resource-groups).|
    | **Resource group location** | Select a location from the drop-down list  | Specifies the Azure location to store your CDN profile information. This location has no impact on CDN endpoint locations.|
    | **Pricing tier** | Select **Standard Verizon** | For a comparison of the features available with each pricing tier, see [Azure CDN features](../articles/cdn/cdn-overview.md#azure-cdn-features).|
   
3. Select **Pin to dashboard** to save the profile to your dashboard after it is created to make it easier to find.
    
4. Select **Create** to create the profile. 

