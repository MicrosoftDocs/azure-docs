> [!NOTE]
> If no patch is specified, the cluster will automatically be upgraded to the specified minor version's latest GA patch. For example, setting `--kubernetes-version` to `1.21` will result in the cluster upgrading to `1.21.9`.
>
> When upgrading by alias minor version, only a higher minor version is supported. For example, upgrading from `1.20.x` to `1.20` will not trigger an upgrade to the latest GA `1.20` patch, but upgrading to `1.21` will trigger an upgrade to the latest GA `1.21` patch.
