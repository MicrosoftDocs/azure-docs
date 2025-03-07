```
Message: The client {principal Id} with object id {principal object Id} has permission to perform action Microsoft.ExtendedLocation/customLocations/resourceSyncRules/write on scope {resource sync resource Id}; however, it does not have permission to perform action(s) Microsoft.Authorization/roleAssignments/write on the linked scope(s) {resource sync resource group} (respectively) or the linked scope(s) are invalid.
```

Deployment of resource sync rules require the logged-in principal to have the `Microsoft.Authorization/roleAssignments/write` permission against the resource group that resources are being deployed to. This is a necessary security constraint as edge to cloud resource hydration will create new resources in the target resource group. 

To resolve, either elevate principal permissions, or don't deploy resource sync rules. Current AIO CLI has an opt-in mechanism to deploy resource sync rules via `--enable-rsync`. Simply omit this flag. Legacy AIO CLIs had an opt-out mechanism via `--disable-rsync-rules`.