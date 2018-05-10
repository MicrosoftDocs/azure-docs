## Clean Up
To completely delete an Azure Dev Space in Azure, including all the running services within it, use the `azds resource rm` command. Please bear in mind that this action is irreversible.

The following example lists the Azure Dev Spaces in your active Azure subscription, and then deletes the environment named 'myenv' that is in the resource group 'myenv-rg'.

```cmd
azds resource list
vsce rm --name myenv --resource-group myenv-rg
```

