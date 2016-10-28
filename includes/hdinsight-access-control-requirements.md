If you use an Azure subscription where you are not the administrator/owner, such as a company owned subscription, you must verify the following before using the steps in this document:

* Your Azure login must have at least __Contributor__ access to the Azure resource group that you use when creating HDInsight (and other Azure resources.)

* Someone with at least __Contributor__ access to the Azure subscription must have previously registered the provider for the resource you are using. Provider registration happens when a user with Contributor access to the subscription creates a resource for the first time on the subscription. It can also be accomplished without creating a resource by [registering a provider using REST](https://msdn.microsoft.com/library/azure/dn790548.aspx).

For more information on working with access management, see the following documents:

* [Get started with access management in the Azure portal](../articles/active-directory/role-based-access-control-what-is.md)
* [Use role assignments to manage access to your Azure subscription resources](../articles/active-directory/role-based-access-control-configure.md)
