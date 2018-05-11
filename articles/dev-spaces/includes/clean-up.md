## Clean Up
To completely delete an Azure Dev Space, including all the running services within it, use the `azds resource rm` command. Bear in mind that this action is irreversible.

The following example lists the Azure Dev Spaces in your active subscription, and then deletes the environment named 'myenv' that is in the resource group 'myenv-rg'.

```cmd
azds resource list
azds rm --name myenv --resource-group myenv-rg
```

