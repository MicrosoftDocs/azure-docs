## Clean Up
To completely delete a Connected Environment in Azure, including all the running services within it, use the `vsce env rm` command. Please bear in mind that this action is irreversible.

The following example lists the Connected Environments in your active Azure subscription, and then deletes the environment named 'myenv' that is in the resource group 'myenv-rg'.

```cmd
vsce env list
vsce env rm --name myenv --resource-group myenv-rg
```

