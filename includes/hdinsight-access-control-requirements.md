If you use an Azure subscription where you are not the administrator or owner, such as a company-owned subscription, you must verify the following before you use the steps in this article:

* To sign in to Azure, you need at least Contributor access to the Azure resource group. This resource group is used to create an Azure HDInsight cluster and other Azure resources.
* Someone with at least Contributor access to the Azure subscription must have previously registered the provider for the resource you are using. Provider registration happens when a user with Contributor access to the subscription creates a resource for the first time on the subscription. It can also be accomplished without creating a resource by [registering a provider by using REST](https://msdn.microsoft.com/library/azure/dn790548.aspx).

For more information on working with access management, see the following articles:

* [Get started with access management in the Azure portal](../articles/active-directory/role-based-access-control-what-is.md)
* [Use role assignments to manage access to your Azure subscription resources](../articles/active-directory/role-based-access-control-configure.md)
