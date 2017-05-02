You apply tags to your Azure resources to logically organize them by categories. Each tag consists of a key and a value. For example, you can apply the key "Environment" and the value "Production" to all the resources in production. Without this tag, you may have difficulty identifying whether a resource is intended for development, test, or production. However, "Environment" and "Production" are just examples. You define the keys and values that make the most sense for organizing your subscription.

After applying tags, you can retrieve all the resources in your subscription with that tag key and value. Tags enable you to retrieve related resources that reside in different resource groups. This approach is helpful when you need to organize resources for billing or management.

The following limitations apply to tags:

* Each resource or resource group can have a maximum of 15 tag key/value pairs. This limitation only applies to tags directly applied to the resource group or resource. A resource group can contain many resources that each have 15 tag key/value pairs. 
* The tag name is limited to 512 characters.
* The tag value is limited to 256 characters. 
* Tags applied to the resource group are not inherited by the resources in that resource group. 

If you have more than 15 values that you need to associate with a resource, use a JSON string for the tag value. The JSON string can contain many values that are applied to a single tag key. An example of assigning a JSON string to the tag key is shown in this article.