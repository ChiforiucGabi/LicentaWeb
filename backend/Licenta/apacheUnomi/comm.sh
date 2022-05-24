JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
PATH=$JAVA_HOME/bin:$PATH

cat /dev/null > /etc/environment

echo PATH=\"$PATH\" >> /etc/environment