namespace UploaderBackend.Interfaces
{
    public interface IValidationService
    {
        void Validate(IFormFileCollection files);
    }
}
