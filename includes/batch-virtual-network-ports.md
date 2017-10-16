
    |    Destination Port(s)    |    Source IP address      |    Does Batch add NSGs?    |    Required for VM to be usable?    |    Action from user   |
    |---------------------------|---------------------------|----------------------------|-------------------------------------|-----------------------|
    |   29876, 29877         |    Only Batch service role IP addresses |    Yes. Batch adds NSGs at the level of network interfaces (NIC) attached to VMs. These NSGs allow traffic only from Batch service role IP addresses. Even if you open these ports for the  entire web, the traffic will get blocked at the NIC. |    Yes  |  You do not need to specify an NSG, because Batch allows only Batch IP addresses. <br /><br /> However, if you do specify an NSG, please ensure that these ports are open for inbound traffic. <br /><br /> If you specify * as the source IP in your NSG, Batch still adds NSGs at the level of NIC attached to VMs. |
    |    3389 (Windows), 22 (Linux)               |    User machines, used for debugging purposes, so that you can remotely access the VM.    |    No                                    |    No                     |    Add NSGs if you want to permit remote access (RDP or SSH) to the VM.   |                                


    |    Outbound Port(s)    |    Destination    |    Does Batch add NSGs?    |    Required for VM to be usable?    |    Action from user    |
    |------------------------|-------------------|----------------------------|-------------------------------------|------------------------|
    |    443    |    Azure Storage    |    No    |    Yes    |    If you add any NSGs, then ensure that this port is open to outbound   traffic.    |