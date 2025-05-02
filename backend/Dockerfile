FROM node:16-alpine

WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar el resto del código
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
