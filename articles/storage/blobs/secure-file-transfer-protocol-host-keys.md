---
title: Host keys for Secure File Transfer Protocol (SFTP) support in Azure Blob Storage (preview) | Microsoft Docs
description: Find a list of valid host keys when using an SFTP client to connect with Azure Blob Storage.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: reference
ms.date: 11/15/2021
ms.author: normesta
ms.reviewer: ylunagaria

---

# Host keys for Secure File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)

This article contains a list of valid host keys used to connect to Azure Blob Storage from SFTP clients.

Blob storage now supports the Secure File Transfer Protocol (SFTP). This support provides the ability to securely connect to Blob Storage accounts via an SFTP endpoint, allowing you to leverage SFTP for file access, file transfer, as well as file management. For more information, see [Secure File Transfer (SFTP) protocol support in Azure Blob Storage](secure-file-transfer-protocol-support.md).

When you connect to Blob Storage by using an SFTP client, you might be prompted to trust a host key. During the public preview, you can verify the host key by finding that key in the list presented in this article. 

> [!IMPORTANT]
> SFTP support is currently in PREVIEW and is available in [these regions](secure-file-transfer-protocol-support.md#regional-availability).
> 
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> To enroll in the preview, see [this form](https://forms.office.com/r/gZguN0j65Y).

## Valid host keys

> [!div class="mx-tdCol4BreakAll"]
> | Region | Host key type | SHA 256 fingerprint <sup>1</sup> | Public key |
> |---|---|---|---|
> | eastus2euap | rsa-sha2-256 | `0b0IILN+fMMAZ7CZePfSVdFj14ppjACcIl4yi3hT/Rc` | `AAAAB3NzaC1yc2EAAAADAQABAAABAQDE45HQiHTS8Vxs6ktkHVrDoWFYnDzTOFzVF9IE0EZp/NMVIqRSnveYyFcgWtg7AfG648DiPsEar3lHmcGKT5OxGJ7KGP6Z8Nd1HxWC75j59GDadLfkuJyFLnWuSQIyiLV9nsDgl2e/BQ4owhHZhlSUCBlsWkECBaACptS5AvWG5CQN6AQnR2L0CEEjPPUSPh6YibqHCITsCAAduH1N8S2B+xj+OqPLpEqbIUpF6aEHggMrb9/CKBsaRzN9LXXIyJJ2Rovg54bkTUDhQO80JnGzCWQvqT1JX4KSQcr0KzkzoOoPLwuQ6w0FxP3UD+zPLYi2V8MNlW3Xp86bNHoUDfhR` |
> | eastus2euap | rsa-sha2-512 | `pv4MPlF/uF1/1qg6vUoCGCTrXyxwTvTJykicv0IIeZA` | `AAAAB3NzaC1yc2EAAAADAQABAAABAQDu64NcnMdsh2vvxfC/2PtYXRYk5IoGB1PSXkrbqov5VllVbJAF9du9V4ccHoLVppux2W1jDlFQ7E+TdOT/hnwmnQurUTAvW355LPG0MtUFPcVCEfEPbxKuv7pxCPKZAWUpMX1aLbmEjt3CX157dtKMhmOkyExLRWu4Ua65LrqpGlKovg8Pzuxc/k6Bznxmj++G3XbHv82F3UXDsXJvUOxmF6DiuDuRWBUIwLGBNJOw2/ddyan34qK2fPBUP+lPSrucinG4b+X7aJHFhTt1E6h9XBs8fYp/9SIZ6c6ftQ/ZbET66NRSS7H7D72tSFJI5lhrKCeoKU/e0GAplSEiPNLR` |
> | eastus2euap | ecdsa-sha2-nistp256 | `V21Ku/gEEacUyR8VuG5WjVOgBfWdPVPD1KsgCpk8eqI` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBPd+eEm6eCdZCbpaVGZPvYmetmpOnrDsemOkj9KMmVimESN2k6I0sKNUhwntMTXGx0nPNeKWG3g/ETzKF3VsYn8=` |
> | eastus2euap | ecdsa-sha2-nistp384 | `Yv87+z8s9fDkiluM3ZkbsgENLGe48ITr+fnuwoG2+kg` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBAYVtgfJ36apFiv6gIxBa/q4n08flTyA0W0cGTsN0ot59nbl6pPCrRCfSByRtzgRY+id9ZOeuZTvN8VpPsZWOSfUOwxE0/GC2c9kS0F4SrFzTALaMY6pY3/GhMrQelAmFw==` |
> | francec | ecdsa-sha2-nistp256 | `p7eHtX2lbIqu06mDFezjRBf7SxlHokVOC+MdcpdO2bM` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBKtYOFWJFlknTvpl2XpxYMrkb0ULCF+ZfwVxwDXUY3zIMANy0hmbyZ73x15EwDP3DobilK149W570x3+TAdwE7o=` |
> | francec | ecdsa-sha2-nistp384| `kbK8Ld5FYOfa+r1PnKooDglmdzLVGBQWNqnMoYOMdGk` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBF8e5s445PAyVF3kgnPP6XoBlCUW+I6HCcQcC+xRti9OTciBAQReKX9c39J15Xoa6iSWuQ0ru9ER5UzXS+bjzhXBKXOmgAcR3/XEJMonjS2++XMldlGhgt1c4hEW3QQGVQ==` |
> | canadaeast | ecdsa-sha2-nistp256 | `ppta3xQWBvWxjkRy0CyFY6a+qB3TrFI1qoCnXnSk3cY` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBLIb5mteX+Vk00D8pPmjYuYBqC9g1xdmN8e3apdsXBucC8qXx9qug7veSex0/NzkTu00kIVVtvW+4LFOvhbat5Y=` |
> | canadaeast | ecdsa-sha2-nistp384 | `RQXlsP8rowi9ndsJe+3zOl87/O2OOpjXA/rasqLQOns` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBO3mWu+SY6u27HQuJq154HCTrGxVsy9axbwTdVXFvgV1h1uhpIdgAZDL55bDe7ZPmB0BPirPas/vUQyG8aGDNAZJn1iinq/umZegYb0BCDthR5bPi7SPb3h7Qf6FN4dXoA==` |
> | usnorth | ecdsa-sha2-nistp256 | `6xMRs7dmIdi3vUOgNnOf6xOTbF9RlGk6Pj7lLk6z/bM` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBJw1dXTy1YqYLJhAo1tB+F5NNaimQwDI+vfEDG4KXIFfS83mUFqr9VO9o+zgL3+0vTrlWQQTsP/hLHrjhHd9If8=` |
> | usnorth | ecdsa-sha2-nistp384 | `0cJkHHeTNQpl7ewPTZwug5+/hfebiH6Yxl2rOTtYZQo` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBG8aqja46A9Q5PmhPzhxcklcJGp+CiC3MCjVR6Qdl9oQGMywOHfe+kCD72YBKnA6KNudZdx7pUUB/ZahvI5vwt4bi593adUMTY1/RlTRjplz6c2fSfwSO/0Ia4+0mxQyjw==` |
> | canadacentral	 | ecdsa-sha2-nistp256 | `7QJ5hJsY84IxPMXFyL1NzG5OVNUEndWru1jNBxP26fI` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBAGEx7ZWe5opSy1zUn4PNfmAvWmTVRRTq2bwoQ5Dibfsr1byd7IIkhD5+0P5ybtq1dEdxh9oK2IjFSQWzj9jFPY=` |
> | canadacentral | ecdsa-sha2-nistp384 | `xqbUD0NAFshX0Cbq6XbxHOMB+9vSaQXCmv/mlHdUuiw` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBBmGFDJBLNDi3UWwk8IMuJQXK/927uHoYVK/wLH7zI7pvtmgb9/FdXa7rix8QVTsfk8uK8wxxqyIYYApUslOtUzkpkXwW9gx7d37wiZmTjEbsvVeHq+gD7PHmXTpLS8VPQ==` |
> | europewest | ecdsa-sha2-nistp256 | `7Lrxb5z3CnAWI8pr2LK5eFHwDCl/Gtm/fhgGwB3zscw` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBE/ewktdeHJc4bH41ytmxvMR3ch9IOR+CQ2i2Pejbavmgy6XmkOnhpIPKVNytXRCToDysIjWt7DLVsQ1EHv/xtg=` |
> | europewest | ecdsa-sha2-nistp384 | `UpzudqPZw1MrBiBoK/HHtLLppAZF8bFD75dK7huZQnI` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBEDYr3fSaCAcTygFUp7MKpND4RghNd6UBjnoMB6EveRWVAiBxLTsRHNHaZ+jk3Q8kCHSEJrWKAOY4aZl78WtWcrmlWLH8gfLtcfG/sXmXka8klstLhmkCvzUXzhBclBy7w==` |
> | switzerlandn | ecdsa-sha2-nistp256 | `DfyPsw04f2rU6PXeLx8iVRu+hrtSLushETT3zs5Dq7U` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBJICveabT6GPfbyaCSeU7D553Q4Rr/IgGjTMC8vMCIUJKUzazeCeS3q46mXL2kwnBLIge9wTzzvP7JSWf+I2Fis=` |
> | switzerlandn | ecdsa-sha2-nistp384 | `Rw0TLDVU4PqsXbOunR2BZcn2/wqFty6rCgWN4cCD/1Y` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBLLhGaEyHYvfVU05lmKV4Rnrl9YiuSSOCXjUaJjJJRhe5ZXbDMHeiC67CAWW3mm/+c5i1hoob/8pHg7vmeC+ve+Ztu/ww12JsC4qy/CG8qIIQvlnDDqnfmOgr0Svw3/Izw==` |
> | australiaeast | ecdsa-sha2-nistp256 | `s8NdoxI0mdWchKMMt/oYtnlFNAD8RUDa1a4lO8aPMpQ` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBBKG2nz5SnoR5KVYAnBMdt8be1HNIOkiZ5UrHxm4pZpLG3LCuzLEXyWlhTm8rynuM/8rATVB5FZqrDCIrnn8pkw=` |
> | australiaeast | ecdsa-sha2-nistp384 | `YmeF1kX0R0W/ssqzKCkjoSLh3CciQvtV7iacYpRU2xc` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBFJi5nieNPCIxkYS7HKMH2fQgONSy2kGkViQucVhWrTJCEQMVz5peL2JZJFjf2a6zaB2olPaBNEkeuJRHxGyW0luTII9ZXXUoiGQH9l05B41mweVtG6pljHfuKQ4HzoUJA==` |
> | asiaeast | ecdsa-sha2-nistp256 | `/iq1i88fRFHFBw4DBtZUX7GRbT5dQq4g7KfUi5346co` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBCvI7Dc7W3K919GK2VHZZkzJhTM+n2tX3mxq4EAI7l8p0HO0UHSmucHdQhpKApTIBR0j9O/idZ/Ew6Yr4nusBwE=` |
> | asiaeast | ecdsa-sha2-nistp384 | `KssXSE1WC6Oca0dS2CNySgObkbVshqRGE2JcaNsUvpA` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBNEYGYGolx8LNs5TVJRF/yoxOCal3a4C0fw1Wlj1BxzUsDtxaQAxSfzQhZG+lFCF7RVQyiUwKjCxmWoZbSb19aE7AnRx9UOVmrbTt2PMD3dx8VmPj1K8rsPOSq+XX4KGdQ==` |
> | germanywc | ecdsa-sha2-nistp256 | `Ce+h+7thT5tt75ypIkWZ6+JnmQMZEl1N7Tt3Ldalb64` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBBmVDE0INhtrKI83oB4r8eU1tXq7bRbzrtIhZdkgiy3lrsvNTEzsEExtWae2uy8zFHdkpyTbBlcUYCZEtNr9w3U=` |
> | germanywc | ecdsa-sha2-nistp384 | `hhQQi2iRjSX5d9c+4714hAFvTA3c63+TGknhuQi7Tss` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBDlFF3ceA17ZFERfvijHkPI2Na1wuti9/AOY5E/bDvZfP08kkmYTb9Ma6omhB0dHR6e1CmRJfKmFXfTd81iVWPa7yXCxbS8yG+uNKCuHxuNv8hFhNM84h2727BSBHBBHBA==` |
> | europenorth | ecdsa-sha2-nistp256 | `wUF5N8VjGTnA/PYBVzQrhcrMgHuCfAYL1tu+p6s28Ms` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBCh4oFTmr3wzccXcayCwvcx+EyvZ7yANMYfc3epZqEzAcDeoPV+6v58gGhYLaEVDh69fGdhiwIvMcB7yWXtqHxE=` |
> | europenorth | ecdsa-sha2-nistp384 | `w7dzF6HD42eE2dgf/G1O73dh+QaZ7OPPZqzeKIT1H68` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBLgyasQj6FYeRa1jiQE4TzOGY/BcQwrWFxXNEmbyoG89ruJcmXD01hS2RzsOPaVLHfr/l71fslVrB8MQzlj3MFwgfeJdiPn7k/4owFoQolaZO7mr/vY/bqOienHN4uxLEA==` |
> | uscentraleuap | ecdsa-sha2-nistp256 | `J9oxrXZ6jDR01CcDWu6xhoRAY60R1SpqbeKA4S9EjNc` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBPNv9UEan8fLKmcI/RK53nX+TD9Pm/RfOKVa1b/leKSByIzMBWQFwa6wxwtr/shl6zvjwT4E9uRu6TsRTYnk+AI=` |
> | uscentraleuap | ecdsa-sha2-nistp384 | `SeX6s483/LpSdx8kIy+KWm5Bb6zy6wr3icyhq1DQydU` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBGcFnKk6dlO6bG0YSPZruEp6bXZP3h6QvCA+jmxScUz7MIgufRT3lrxkrZs0RM9vp44i2HXOSowsgvVPDQMBJRF5gXsEU1Z9SrpqOUrlcyhzfy0SkaewuNM6VoAYjUn44g==` |
> | useast2 | ecdsa-sha2-nistp256 | `bouiC5HdtURUU19RJbym8R94fbMOTw/bUxFUkoAByoI` | `AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBJshJI18IECu6neLrash/Q622MAXO07C+hbIOiVPC6M/ZIJM8HyYvQEh4DKI1CMEaeAIs/HA905QKeU/syvt7QI=` |
> | useast2 | ecdsa-sha2-nistp384 | `vWnPlGaQOY4LFj9XSQ2qN/NMF92+UOfKPjGNSPA2bOg` | `AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBByJNAblwxCNVqedg5FcdbdwiuzTMVEWj/uF3uzI8wp890Xv2M4H+aMTpeItxgQsuiQCptgITsO+XCf2dBTHOGWpd90QtvcznzHyy/FEWVAKWs9brvyaNVe82c4TOFqYRg==` |

<sup>1</sup>    The SHA 256 fingerprint is used by Open SSH and WinSCP.

## See also

- [Secure File Transfer (SFTP) protocol support in Azure Blob Storage](secure-file-transfer-protocol-support.md)