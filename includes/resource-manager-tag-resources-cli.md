To add a tag to a resource group, use **azure group set**. If the resource group does not have any existing tags, pass in the tag.

```azurecli
azure group set -n tag-demo-group -t Dept=Finance
```

Tags are updated as a whole. If you want to add a tag to a resource group that has existing tags, pass all the tags. 

```azurecli
azure group set -n tag-demo-group -t Dept=Finance;Environment=Production;Project=Upgrade
```

Tags are not inherited by resources in a resource group. To add a tag to a resource, use **azure resource set**. Pass the API version number for the resource type that you are adding the tag to. If you need to retrieve the API version, use the following command with the resource provider for the type you are setting:

```azurecli
azure provider show -n Microsoft.Storage --json
```

In the results, look for the resource type you want.

```azurecli
"resourceTypes": [
{
  "resourceType": "storageAccounts",
  ...
  "apiVersions": [
    "2016-01-01",
    "2015-06-15",
    "2015-05-01-preview"
  ]
}
...
```

Now, provide that API version, resource group name, resource name, resource type, and tag value as parameters.

```azurecli
azure resource set -g tag-demo-group -n storagetagdemo -r Microsoft.Storage/storageAccounts -t Dept=Finance -o 2016-01-01
```

Tags exist directly on resources and resource groups. To see the existing tags, get a resource group and its resources with **azure group show**.

```azurecli
azure group show -n tag-demo-group --json
```

Which returns metadata about the resource group, including any tags applied to it.

```azurecli
{
  "id": "/subscriptions/4705409c-9372-42f0-914c-64a504530837/resourceGroups/tag-demo-group",
  "name": "tag-demo-group",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "location": "southcentralus",
  "tags": {
    "Dept": "Finance",
    "Environment": "Production",
    "Project": "Upgrade"
  },
  ...
}
```

You view the tags for a particular resource by using **azure resource show**.

```azurecli
azure resource show -g tag-demo-group -n storagetagdemo -r Microsoft.Storage/storageAccounts -o 2016-01-01 --json
```

To retrieve all the resources with a tag value, use:

```azurecli
azure resource list -t Dept=Finance --json
```

To retrieve all the resource groups with a tag value, use:

```azurecli
azure group list -t Dept=Finance
```

You can view the existing tags in your subscription with the following command:

```azurecli
azure tag list
```
