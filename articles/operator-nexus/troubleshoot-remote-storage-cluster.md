# Troubleshooting Remote Storage Issues With The Cluster Resource
Some of the reasons that a cluster could be marked as degraded or unhealthy are related to remote
storage (the storage that backs `nexus-volume` or `nexus-shared` volumes). You can see which issue
you are having by checking the "Availability Impacting Reason" field.

If the "Availability Impacting Reason" starts with any of the prefixes below, the issue is with
remote storage:
- ControlPlaneStorageConnectivity
- CSI
- NFS

## Cluster Control Plane Connectivity
This will have an "Availability Impacting Reason" of:
- `ControlPlaneStorageConnectivityDegraded` which means one of the control plane endpoints is
disconnected from the cluster. This represents a loss of redundancy for storage control plane
operations.
- `ControlPlaneStorageConnectivityUnhealthyVIP` which means the VIP which all storage control plane
traffic is sent to is disconnected from the cluster. All control plane operations for `nexus-volume`
and `nexus-shared` volumes will fail.
- `ControlPlaneStorageConnectivityUnhealthyControllers` which means all control plane endpoints are
disconnected from the cluster. All control plane operations for `nexus-volume` and `nexus-shared`
volumes will fail.

Before raising a generic ticket, there are 2 things you can rule out:
- Send an engineer to the site, to check for a physical disconnection (eg. loose cable).
- Check for other alerts, especially on the Storage Appliance. Check the 
`Nexus Storage Network Interface Performance Errors`, `Nexus Storage Hardware Component Status` and 
`Nexus Storage Alerts Open` metrics by navigating to the Storage Appliance in the portal. If the
issue is with the Appliance it will be quicker to raise a ticket directly with your Storage Appliance
vendor.

If you have eliminated both of these problems, please raise a ticket, using the process below.

## Raising A Ticket For Storage Cluster Health Issues
In most cases where the cluster is unhealthy due to issues with remote storage, a ticket will need to
be raised. For these cases, please raise a ticket containing the cluster name, the "Availability
Impacting Reason", and the fact that the issue is in remote storage. This will lead to faster triage
of your ticket. 