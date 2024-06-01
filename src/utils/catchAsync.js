const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch((err) => {
        next(err);
    });
};

function wrapCatchAsyncFunctions(ClassObject) {
    const methods = Object.getOwnPropertyNames(ClassObject);

    methods.forEach((methodName) => {
        if (typeof ClassObject[methodName] === 'function') {
            ClassObject[methodName] = catchAsync(ClassObject[methodName]);
        }
    });
}
export default wrapCatchAsyncFunctions;
