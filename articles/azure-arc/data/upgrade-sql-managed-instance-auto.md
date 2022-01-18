# Enabling automatic upgrades of a SQL Managed Instance

!Note: Preview feature. 

You can set the [--desired-version parameter | spec.update.desiredVersion property] of a SQL Managed Instance to `auto` to ensure that your Managed Instance will be upgraded after a data controller upgrade, with no interaction from a user. This allows for ease of management, as you do not need to manually upgrade every instance for every release. 

After setting the [--desired-version parameter | spec.update.desiredVersion property] to `auto` the first time, within five minutes the Managed Instance will begin an upgrade to the newest image version. Thereafter, within five minutes of a data controller being upgraded, the Managed Instance will begin the upgrade process. This works for both directly connected and indirectly connected modees. 

If the spec.update.desiredVersion property is pinned to a specific version, automatic upgrades will not take place. This allows you to let most instances automatically upgrade, while manually managing instances that need a more hands-on approach. 

## How to enable with with K8s: 

Use a kubectl command to view the existing spec in yaml. 

```console
kubectl --namespace <namespace> get sqlmi <sqlmi-name> --output yaml
```

Run kubectl patch to set `desiredVersion` to `auto`.

```console
kubectl patch sqlmi <sqlmi-name> --namespace <namespace> --type merge --patch '{"spec": {"update": {"desiredVersion": "auto"}}}'
```

## How to enable with CLI:

To set the `--desired-version` to `auto`, use the following command:

Indirectly connected: 

````cli
az sql mi-arc upgrade --name <instance name> --desired-version auto --k8s-namespace <namespace> --use-k8s
````

Example:

````cli
az sql mi-arc upgrade --name instance1 --desired-version auto --k8s-namespace arc1 --use-k8s
````

Directly connected: 

````cli
az sql mi-arc upgrade --resource-group <resource group> --name <instance name> --desired-version auto [--no-wait]
````

Example:

````cli
az sql mi-arc upgrade --resource-group rgarc --name instance1 --desired-version auto 
````