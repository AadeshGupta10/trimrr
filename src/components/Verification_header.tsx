interface props {
    name?: string
}

const Verification_header = ({ name }: props) => {
    return (
        <p className='text-3xl ms-[-.14rem] mb-4 font-semibold cursor-default'>
            {name}
        </p>
    )
}

export default Verification_header