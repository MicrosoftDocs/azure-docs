---
author: PatrickFarley
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

> [!IMPORTANT]
> Use the most recent LTS release of the Linux distribution. For example, if you are using Ubuntu 20.04 LTS, use the latest release of Ubuntu 20.04.X.

The Vision SDK depends on the following Linux system libraries:

- The shared libraries of the GNU C library, including the POSIX Threads Programming library, `libpthreads`
- The OpenSSL library (`libssl`) version 1.x

> [!IMPORTANT]
> The Vision SDK does not yet support OpenSSL 3.0, which is the default in Ubuntu 22.04 and Debian 12. 

To install OpenSSL 1.x from sources on Debian/Ubuntu based systems that don't have it, do:
```Bash
wget -O - https://www.openssl.org/source/openssl-1.1.1u.tar.gz | tar zxf -
cd openssl-1.1.1u
./config --prefix=/usr/local
make -j $(nproc)
sudo make install_sw install_ssldirs
sudo ldconfig -v
export SSL_CERT_DIR=/etc/ssl/certs
```
Notes on installation:
- Check https://www.openssl.org/source/ for the latest OpenSSL 1.x version to use.
- The setting of `SSL_CERT_DIR` must be in effect systemwide or at least in the console where applications that use the Vision SDK are launched from, otherwise OpenSSL 1.x installed in `/usr/local` may not find certificates.
- Ensure that the console output from `ldconfig -v` includes `/usr/local/lib` as it should on modern systems by default. If this isn't the case, set `LD_LIBRARY_PATH` (with the same scope as `SSL_CERT_DIR`) to add `/usr/local/lib` to the library path:
  ```Bash
  export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
  ```

# [Ubuntu 18.04/20.04/22.04](#tab/ubuntu)

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev wget
```

# [Debian 9/10/11](#tab/debian)

To use the Vision SDK in Alpine Linux, create a Debian chroot environment as documented in the Alpine Linux Wiki on [running glibc programs](https://wiki.alpinelinux.org/wiki/Running_glibc_programs). Then follow the Debian instructions here.

```Bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev wget
```

---
