# Mount the file share

With support for SMB 3.0, File storage now supports encryption and persistent
handles from SMB 3.0 clients. Support for encryption means that SMB 3.0 clients
can mount a file share from anywhere, including from:

-   An Azure virtual machine in the same region (also supported by SMB 2.1)

-   Most Linux SMB client doesn’t yet support encryption, so mounting a file share
from Linux still requires that the client be in the same Azure region as the
file share.

-   An Azure virtual machine in a different region (SMB 3.0 only)

-   An on-premises client application (SMB 3.0 only)

When a client accesses File storage, the SMB version used depends on the SMB
version supported by the operating system. The table below provides a summary of
support for Windows and Linux clients. Please refer to this blog for more
details on [SMB
versions](http://blogs.technet.com/b/josebda/archive/2013/10/02/windows-server-2012-r2-which-version-of-the-smb-protocol-smb-1-0-smb-2-0-smb-2-1-smb-3-0-or-smb-3-02-you-are-using.aspx).

| Windows and Linux Client                        | SMB Version Supported |
|-------------------------------------------------|-----------------------|
| Windows 7                                       | SMB 2.1               |
| Windows Server 2008 R2                          | SMB 2.1               |
| Windows 8                                       | SMB 3.0               |
| Windows Server 2012                             | SMB 3.0               |
| Windows Server 2012 R2                          | SMB 3.0               |
| Windows 10                                      | SMB 3.0               |
| Ubuntu Server 14.04+                            | SMB 2.1               |
| RHEL 7+                                         | SMB 2.1               |
| CentOS 7+                                       | SMB 2.1               |
| Debian 8                                        | SMB 2.1               |
| openSUSE 13.2+                                  | SMB 2.1               |
| SUSE Linux Enterprise Server 12                 | SMB 2.1               |
| SUSE Linux Enterprise Server 12 (Premium Image) | SMB 2.1               |
| Mac OS Sierra                                   | SMB 3.0               |
