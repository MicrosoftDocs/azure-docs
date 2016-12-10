1. In **Add vCenter**, specify a friendly name for the vSphere host or vCenter server, and specify the IP address or FQDN of the server. Leave the port as 443 unless your VMware servers are configured to listen for requests on a different port. Then select the account that will be used to connect to the VMware server. Click **OK**.

    ![VMware](./media/site-recovery-add-vcenter/vmware-server.png)

   > [!NOTE]
   > If you're adding the vCenter server or vSphere host with an account that doesn't have administrator privileges on the vCenter or host server, make sure that the account has these privileges enabled: Datacenter, Datastore, Folder, Host, Network, Resource, Virtual machine, vSphere Distributed Switch. In addition the vCenter server needs the Storage views privilege.
