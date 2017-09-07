# install_openssl.sh
# Copyright (c) Microsoft. All rights reserved.

brew update

brew install openssl

ln -s /usr/local/opt/openssl/lib/libcrypto.1.0.0.dylib /usr/local/lib/

ln -s /usr/local/opt/openssl/lib/libssl.1.0.0.dylib /usr/local/lib/