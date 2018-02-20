---
 title: include file
 description: include file
 services: azure-resource-manager
 author: tfitzmac
 ms.service: azure-resource-manager
 ms.topic: include
 ms.date: 02/20/2018
 ms.author: tomfitz
 ms.custom: include file
---

To add two tags to a resource group, use:

```azurecli-interactive
az group update -n myResourceGroup --set tags.Environment=Test tags.Dept=IT
```

Let's suppose you want to add a third tag. Run the command again with the new tag. It is appended to the existing tags.

```azurecli-interactive
az group update -n myResourceGroup --set tags.Project=Documentation
```

Resources don't inherit tags from the resource group. Currently, your resource group has three tags but the resources do not have any tags. To apply all tags from a resource group to its resources, and retain existing tags on resources, use the following script:

```azurecli-interactive
jsontag=$(az group show -n myResourceGroup --query tags)
t=$(echo $jsontag | tr -d '"{},' | sed 's/: /=/g')
r=$(az resource list -g myResourceGroup --query [].id --output tsv)
for resid in $r
do
  jsonrtag=$(az resource show --id $resid --query tags)
  rt=$(echo $jsonrtag | tr -d '"{},' | sed 's/: /=/g')
  az resource tag --tags $t$rt --id $resid
done
```

Alternatively, you can apply tags from the resource group to the resources without keeping the existing tags:

```azurecli-interactive
jsontag=$(az group show -n myResourceGroup --query tags)
t=$(echo $jsontag | tr -d '"{},' | sed 's/: /=/g')
r=$(az resource list -g myResourceGroup --query [].id --output tsv)
for resid in $r
do
  az resource tag --tags $t --id $resid
done
```

To combine several values in a single tag, use a JSON string.

```azurecli-interactive
az group update -n myResourceGroup --set tags.CostCenter='{"Dept":"IT","Environment":"Test"}'
```

To remove all tags on a resource group, use

```azurecli-interactive
az group update -n myResourceGroup --remove tags
```
