const data = {}
console.log(data);

data.one = '1'
console.log(data);

data.two = '2'
console.log(data);

const data2 = {
    name: 'est'
}

data[data2.name] = data2.name
console.log(data);