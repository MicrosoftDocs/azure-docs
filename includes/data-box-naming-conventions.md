---
author: stevenmatthew
ms.service: databox  
ms.subservice: heavy 
ms.topic: include
ms.date: 05/21/2019
ms.author: shaas
---

| Entity                                       | Conventions   |
|----------------------------------------------|-----------------------------------------------------|
| Container names for block blob and page blob | Must be a valid DNS name that is 3 to 63 characters long. <br>  Must start with a letter or number. <br> Can contain only lowercase letters, numbers, and the hyphen (-). <br> Every hyphen (-) must be immediately preceded and followed by a letter or number. <br> Consecutive hyphens aren't permitted in names. |
| Share names for Azure files                  | Same as above                                          |
| Directory and file names for Azure files     |<li> Case-preserving, case-insensitive and must not exceed 255 characters in length. </li><li> Cannot end with the forward slash (/). </li><li>If provided, it will be automatically removed. </li><li> Following characters aren't allowed: <code>" \\ / : \| < > * ?</code></li><li> Reserved URL characters must be properly escaped. </li><li> Illegal URL path characters aren't allowed. Code points like \\uE000 aren't valid Unicode characters. Some ASCII or Unicode characters, like control characters (0x00 to 0x1F, \\u0081, etc.), are also not allowed. For rules governing Unicode strings in HTTP/1.1 see RFC 2616, Section 2.2: Basic Rules and RFC 3987. </li><li> Following file names aren't allowed: LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8, LPT9, COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8, COM9, PRN, AUX, NUL, CON, CLOCK$, dot character (.), and two dot characters (..).</li>|
| Blob names for block blob and page blob      | </li><li>Blob names are case-sensitive and can contain any combination of characters. </li><li>A blob name must be between 1 to 1,024 characters long. </li><li>Reserved URL characters must be properly escaped. </li><li>The number of path segments comprising the blob name cannot exceed 254. A path segment is the string between consecutive delimiter characters (for example, the forward slash '/') that correspond to the name of a virtual directory.</li> |

