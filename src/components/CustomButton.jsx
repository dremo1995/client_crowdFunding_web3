import React from 'react'

const CustomButton = ({ styles, btnType, title, handleClick }) =>
{
    return (
        <button
            type={ btnType }
            className={ `font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}` }
            onClick={ handleClick }
            title={ title }
        >{ title }</button>
    )
}

export default CustomButton