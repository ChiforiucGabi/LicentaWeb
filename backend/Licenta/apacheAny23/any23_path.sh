ANY23_HOME="/usr/local/apache-any23-2.7/bin"
PATH=$ANY23_HOME/bin:$PATH

cat /dev/null > /etc/environment

echo PATH=\"$PATH\" >> /etc/environment