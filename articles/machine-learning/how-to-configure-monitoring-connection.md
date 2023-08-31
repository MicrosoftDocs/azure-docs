# TODO

1. Create Azure OpenAI resource
1. set up UAI
1. Assign 'list' permissions
1. assign permissions 

# IMPORTANT - API version TODO add details 
2023-03-15-preview

You will need to configure a workspace connection for your Azure OpenAI resource to have appropriate permissions. 
    1. [LINK](../how-to-configure-monitoring-connection.md)
1. Create an Azure OpenAI resource which will be used as your evaluation endpoint
1. Create your user-assigned managed identity (UAI)
    1. Assign contributor access control to your UAI
    1. You need to assign enough permission. To assign a role, you need to have owner or have Microsoft.Authorization/roleAssignments/write permission on your resource.
1. Ensure your authentication uses key-based authentication and user-assigned identity, and confirm the following access policies are configured: 

| Resource | Role / Access policy | Member | Why it's needed |
|---|---|---|---|
|TBD| **List permissions** role | TBC | List permissions.|


1. > [!NOTE]
> Updating connections and permissions may take several minutes to take effect. If your compute instance behind VNet, please follow [Compute instance behind VNet](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/how-to-create-manage-runtime?view=azureml-api-2#compute-instance-behind-vnet) to configure the network.