@decotator
class TestClass {
    // ...
}

function decotator(targetClass) {

    targetClass.rejectDecorator = true;
}

TestClass.rejectDecorator; // true