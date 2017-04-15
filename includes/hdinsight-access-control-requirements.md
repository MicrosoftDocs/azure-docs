You might use an Azure subscription for which you are not the administrator or owner, such as a company-owned subscription. If this is the case, you must verify that the following have been obtained in order to follow the steps in this article:

* Contributor access. To sign in to Azure, you need at least Contributor access to the Azure resource group. This resource group is used to create an HDInsight cluster and other Azure resources.
* Provider registration. Someone with at least Contributor access to the Azure subscription must have previously registered the provider for the resource you are using. Provider registration happens when a user with Contributor access to the subscription creates a resource for the first time on the subscription. It can also be accomplished without creating a resource by [registering a provider through REST](https://msdn.microsoft.com/library/azure/dn790548.aspx).

For more information on working with access management, see the following articles:

* [Get started with access management in the Azure portal](../articles/active-directory/role-based-access-control-what-is.md)
* [Use role assignments to manage access to your Azure subscription resources](../articles/active-directory/role-based-access-control-configure.md)
