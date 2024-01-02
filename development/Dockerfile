ARG NODE_VERSION="20"

FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${NODE_VERSION}-bullseye

ARG USERNAME="node"
ARG USER_UID="1000"
ARG USER_GID=${USER_UID}

RUN getent group ${USER_GID} || groupmod --gid ${USER_GID} ${USERNAME} \
 && usermod --uid ${USER_UID} --gid ${USER_GID} ${USERNAME} \
 && chown -R ${USER_UID}:${USER_GID} /home/${USERNAME}

USER ${USERNAME}

RUN npm install --global prettier
