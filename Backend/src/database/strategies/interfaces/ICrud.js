class NotImplemented extends Error {
    constructor() {
        super("Método não implementado");
    }
}

class ICrud {
    isConected(){
        throw new NotImplemented();
    }
    connect(){
        throw new NotImplemented();
    }
    create(item) {
        throw new NotImplemented();
    }
    read(query) {
        throw new NotImplemented();
    }
    update(id, item) {
        throw new NotImplemented();
    }
    delete(id) {
        throw new NotImplemented();
    }
}

module.exports = ICrud