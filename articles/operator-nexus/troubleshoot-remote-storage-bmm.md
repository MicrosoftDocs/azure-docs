# Troubleshooting Remote Storage Issues With The BMM Resource
Some of the reasons that a BMM could be marked as degraded or unhealthy are related to remote
storage (the storage that backs `nexus-volume` or `nexus-shared` volumes). You can see which issue
you are having by checking the "Availability Impacting Reason" field.

If the "Availability Impacting Reason" starts with any of the prefixes below, the issue is with
remote storage:
- iSCSI
- DataPlane
- Attachment

## Raising A Ticket For Storage BMM Health Issues
If the BMM is unhealthy due to issues with remote storage, a ticket will need to be raised. Please
raise a ticket containing the cluster name, BMM name, the "Availability Impacting Reason", and the
fact that the issue is in remote storage. This will lead to faster triage sof your ticket. 